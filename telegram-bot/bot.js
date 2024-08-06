const { Bot } = require('grammy')
const dotenv = require('dotenv')
const path = require('path')

// load telegram key from .env file
dotenv.config({ path: path.join(__dirname, '../.env') })

const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new Bot(token)

// Register listeners to handle messages
bot.on('message:text', (ctx) => ctx.reply('Echo: ' + ctx.message.text))

// Start the bot (using long polling)
bot.start()
