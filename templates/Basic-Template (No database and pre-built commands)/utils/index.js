require("dotenv").config();

function sendLog(bot, msg) {
    const chId = process.env.LOG_CHANNEL_ID
    if (!chId)
        return console.log("[!] Log channel id not specidied, skipping error logging ...")
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


module.exports = {
    sendLog: sendLog,
    sendToUser: sendToUser,
}
// SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot