const express = require('express')
const bodyParser = require('body-parser')
const { Bot, InlineKeyboard } = require('grammy')

const dotenv = require('dotenv')
const path = require('path')

const { createDirectus, graphql, rest, staticToken, deleteItem, updateItem, readItems } = require('@directus/sdk')

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
      readItems('directus_users', {
        filter: {
          telegram_id: {
            _eq: telegramId
          }
        }
      })
    )
    .then((response) => {
      return response.data[0]
    })
}

const approveRequest = async (bookingId, user_id) => {
  await client.request(updateItem('booking', bookingId, { confirmed: true, confirmed_by: user_id }))
}

const rejectRequest = async (bookingId) => {
  return await client.request(deleteItem('booking', bookingId))
}

// Register listeners to handle messages
// Handling button callbacks with booking ID
bot.on('callback_query:data', async (ctx) => {
  const callbackData = ctx.callbackQuery.data
  const [action, bookingId] = callbackData.split('_') // Split by underscore to get action and booking ID

  await ctx.answerCallbackQuery() // Notify Telegram that the callback was received

  const user = await getUserByTelegramId(ctx.from.id)

  switch (action) {
    case 'accept':
      await approveRequest(bookingId, user.id)
      await ctx.editMessageText(`You accepted booking ID: ${bookingId}`)
      break
    case 'reject':
      await rejectRequest(bookingId)
      await ctx.editMessageText(`You rejected booking ID: ${bookingId}`)
      break
    default:
      await ctx.reply('Unknown action.')
      break
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
// bot.start()

app.post('/send-booking-request-notification', async (req, res) => {
  const telegram_user_id = req.body.telegram_user_id
  const message = req.body.message || 'New booking request'
  const bookingId = req.body.bookingId // Get booking ID from request

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
