const express = require('express')
const bodyParser = require('body-parser')
const { Bot, InlineKeyboard } = require('grammy')

const dotenv = require('dotenv')
const path = require('path')

const app = express()
app.use(bodyParser.json()) // for parsing application/json

// load telegram key from .env file
dotenv.config({ path: path.join(__dirname, '../.env') })

const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new Bot(token)

// Register listeners to handle messages
// Handling button callbacks with booking ID
bot.on('callback_query:data', async (ctx) => {
  const callbackData = ctx.callbackQuery.data
  const [action, bookingId] = callbackData.split('_') // Split by underscore to get action and booking ID

  await ctx.answerCallbackQuery() // Notify Telegram that the callback was received

  switch (action) {
    case 'accept':
      await ctx.editMessageText(`You accepted booking ID: ${bookingId}`)
      break
    case 'reject':
      await ctx.editMessageText(`You rejected booking ID: ${bookingId}`)
      break
    default:
      await ctx.reply('Unknown action.')
      break
  }
})

// Start the bot (using long polling)
// bot.start()z

app.post('/send-message', async (req, res) => {
  const chatId = req.body.chatId
  const message = req.body.message
  const bookingId = req.body.bookingId // Get booking ID from request

  // Create an inline keyboard with dynamic callback data including the booking ID
  const keyboard = new InlineKeyboard()
    .text('Accept', `accept_${bookingId}`) // Append booking ID to callback data
    .text('Reject', `reject_${bookingId}`)

  try {
    await bot.api.sendMessage(chatId, message, {
      reply_markup: keyboard
    })
    res.send({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).send({ success: false, error: error.message })
  }
})

const PORT = process.env.PORT || 12543
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
