const express = require('express')
const bodyParser = require('body-parser')
const { Bot, InlineKeyboard, GrammyError, HttpError } = require('grammy')

const dotenv = require('dotenv')
const path = require('path')

const {
  createDirectus,
  graphql,
  rest,
  staticToken,
  deleteItem,
  updateItem,
  readUsers,
  readItem
} = require('@directus/sdk')

const app = express()
app.use(bodyParser.json()) // for parsing application/json

// load telegram key from .env file
dotenv.config({ path: path.join(__dirname, '../.env') })

const client = createDirectus(process.env.VITE_BACKEND_URL)
  .with(staticToken(process.env.TELEGRAM_DIRECTUS_API_KEY))
  .with(rest())
  .with(graphql())

const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new Bot(token)

const getUserByTelegramId = async (telegramId) => {
  return await client
    .request(
      readUsers({
        fields: ['id'],
        filter: {
          telegram_user_id: {
            _eq: telegramId
          }
        }
      })
    )
    .then((response) => {
      return response[0]
    })
}

const approveRequest = async (bookingId, user_id) => {
  await client.request(updateItem('booking', bookingId, { confirmed: true, confirmed_by: user_id }))
}

const rejectRequest = async (bookingId) => {
  return await client.request(deleteItem('booking', bookingId)).then((response) => {
    console.log('response', response)
  })
}

// Register listeners to handle messages
// Handling button callbacks with booking ID
bot.on('callback_query:data', async (ctx) => {
  const callbackData = ctx.callbackQuery.data
  const [action, bookingId] = callbackData.split('_') // Split by underscore to get action and booking ID

  await ctx.answerCallbackQuery() // Notify Telegram that the callback was received

  console.log('callbackData', callbackData)
  console.log('action', action)
  console.log('bookingId', bookingId)
  console.log('ctx', ctx)
  const user = await getUserByTelegramId(ctx.from.id)

  if (!user) {
    await ctx.editMessageText('User not found.')
    return
  }

  // Check if booking is still available and not confirmed yet
  const booking = await client.request(readItem('booking', bookingId))

  if (!booking) {
    await ctx.editMessageText('Booking has already been rejected.')
    return
  }

  if (booking.confirmed) {
    await ctx.editMessageText('Booking has already been confirmed.')
    return
  }

  const bookable_object = await client.request(readItem('bookable_object', booking.bookable_object_id))

  // format start_date and end_date to german human readable date with time
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
  const start_date_obj = new Date(booking.start_date)
  const end_date_obj = new Date(booking.end_date)
  const start_date_formatted = start_date_obj.toLocaleDateString('de-DE', options)
  const end_date_formatted = end_date_obj.toLocaleDateString('de-DE', options)
  const is_full_day = booking.is_full_day ? 'Yes' : 'No'
  const user_name = booking.display_name || 'N/A'
  const mail = booking.mail || 'N/A'
  const phone = booking.phone || 'N/A'
  const description = booking.description || 'No description'

  const bookable_object_name = bookable_object.name || 'N/A'

  const accepted = action === 'accept'

  const acceptedMessage = `accepted ✅`
  const rejectedMessage = `rejected ❌`

  const message = `
    Booking request for ${bookable_object_name} ${accepted ? acceptedMessage : rejectedMessage} \n\n
    Data:\n
    From: ${user_name}\n
    Email: ${mail}\n
    Phone: ${phone}\n
    Description: ${description}\n
    Start: ${start_date_formatted}\n
    End: ${end_date_formatted}\n
    Full Day: ${is_full_day}\n
    `

  switch (action) {
    case 'accept':
      await approveRequest(bookingId, user.id)
      await ctx.editMessageText(message)
      break
    case 'reject':
      await rejectRequest(bookingId)
      await ctx.editMessageText(message)
      break
    default:
      await ctx.reply('Unknown action.')
      break
  }
})

bot.catch((err) => {
  const ctx = err.ctx
  console.error(`Error while handling update ${ctx.update.update_id}:`)
  const e = err.error
  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description)
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e)
  } else {
    console.error('Unknown error:', e)
  }
})

// // Command handler for viewing current bookings
// bot.command('view_bookings', async (ctx) => {
//   try {
//     console.log(ctx)
//     const bookings = await getCurrentBookings()
//
//     let message = 'Current Bookings:\n\n'
//     if (bookings.length === 0) {
//       message += 'No current bookings.'
//     } else {
//       bookings.forEach((booking, index) => {
//         message += `${index + 1}. Booking ID: ${booking.id}\n`
//         message += `   User: ${booking.user}\n`
//         message += `   Date: ${booking.date}\n\n`
//       })
//     }
//
//     await ctx.reply(message)
//   } catch (error) {
//     console.error(error)
//     await ctx.reply('Failed to retrieve bookings.')
//   }
// })
//
// // Example function to fetch current bookings from a database
// async function getCurrentBookings() {
//   // This is a placeholder. Replace with actual database query logic.
//   return [
//     { id: '1', user: 'User A', date: '2024-08-08' },
//     { id: '2', user: 'User B', date: '2024-08-09' }
//     // Add more bookings as needed
//   ]
// }

// Start the bot (using long polling)
bot.start()

/*
* {
  "telegram_user_id": "191678271",
  "bookingId": 78,
  "display_name": "Frederic Abraham",
  "mail": "mail@fabraham.dev",
  "phone": "+4917693105803",
  "description": "Test",
  "start_date": "2024-08-11T17:30:00.000Z",
  "end_date": "2024-08-11T20:00:00.000Z",
  "is_full_day": false,
  "bookable_object_name": "The Moon",
  "host": "--redacted:FRONTEND_URL--"
}
* */

app.post('/send-booking-request-notification', async (req, res) => {
  const telegram_user_id = req.body.telegram_user_id
  const bookingId = req.body.bookingId // Get booking ID from request

  const mail = req.body.mail || 'N/A'
  const phone = req.body.phone || 'N/A'
  const description = req.body.description || 'No description'
  const start_date = req.body.start_date
  const end_date = req.body.end_date
  const is_full_day = req.body.is_full_day ? 'Yes' : 'No'
  const bookable_object_name = req.body.bookable_object_name || 'N/A'

  // format start_date and end_date to german human readable date
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
  const start_date_obj = new Date(start_date)
  const end_date_obj = new Date(end_date)
  const start_date_formatted = start_date_obj.toLocaleDateString('de-DE', options)
  const end_date_formatted = end_date_obj.toLocaleDateString('de-DE', options)

  const message =
    `New booking request for ${bookable_object_name}:\n\n` +
    `\tFrom: ${req.body.display_name}\n` +
    `\tEmail: ${mail}\n` +
    `\tPhone: ${phone}\n` +
    `\tDescription: ${description}\n` +
    `\tStart Date: ${start_date_formatted}\n` +
    `\tEnd Date: ${end_date_formatted}\n` +
    `\tFull Day: ${is_full_day}\n\n` +
    `Do you want to accept or reject?`

  // Create an inline keyboard with dynamic callback data including the booking ID
  const keyboard = new InlineKeyboard()
    .text('Accept', `accept_${bookingId}`) // Append booking ID to callback data
    .text('Reject', `reject_${bookingId}`)

  try {
    await bot.api.sendMessage(telegram_user_id, message, {
      reply_markup: keyboard
    })
    res.send({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).send({ success: false, error: error.message })
  }
})

const PORT = process.env.PORT || 12543
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
