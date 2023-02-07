require("dotenv").config();
const { getUser } = require('../database')

function sendLog(bot, msg) {
    const chId = process.env.LOG_CHANNEL_ID
    if (!chId)
        return console.log("[!] Log channel id not specidied, skipping ...")
    bot.sendMessage(chId, msg)
        .then(console.log("Error log has been sent."))
        .catch(console.log)
}

function sendToUser(bot, msg, sender_firstname, chat_id, message) {
    bot.sendMessage(chat_id, `[❗] Sent b admin => ${sender_firstname}:\n\n${message}`)
        .then(() => {
            msg.reply.text(`Message sent\n\nchatID: ${chat_id}\n\nContent:\n${message}`)
        })
        .catch(err => msg.reply.text(`[❗] Error Sending message: ${err.message}`))
}

function searchUser(msg, userId) {
    getUser(userId)
        .then(res => msg.reply.text(`[User]:\n   username: ${res.username}\n   firstname= ${res.firstname}\n   lastname= ${!res.lastname ? null : res.lastname}\n   user_id= ${res.user_id}\n   all=${res.all} `))
        .catch(err => msg.reply.text(`[!] Failed : ${err}`))
}

module.exports = {
    sendLog: sendLog,
    sendToUser: sendToUser,
    searchUser: searchUser,
}
// SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot