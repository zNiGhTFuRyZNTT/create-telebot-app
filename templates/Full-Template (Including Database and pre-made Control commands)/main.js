/**
 * @author Armin Amiri
 * @version 1.0.0
 * @description Telebot boilerplate project template.
*/
require('dotenv').config()
const TeleBot = require('telebot')
const Database = require('./database')
const token = process.env.API_KEY
const bot = new TeleBot({
    token: token,
    // usePlugins: ['floodProtection',]  // Attention! Using the 'floodProtection' plugin may interrupt some modifiers.
})

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

// < - -- -- Driver Code -- -- - >
if (typeof require !== 'undefined' && require.main === module) {
    require("./core").init(bot) //prepare the bot, load commands, events, etc.
    bot.start() // start polling...
}

/*
    There are a few samples of commands and events already created at "/events" and "/commands". 
        > you can edit/delete them as you wish.
        * Do not edit any of the code inside /modifiers/text.js unless you know what you are doing. 
        * SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot
*/