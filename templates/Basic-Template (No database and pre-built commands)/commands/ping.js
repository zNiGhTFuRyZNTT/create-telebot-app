module.exports = {
    name: 'ping', // send message to a bot user using userId
    async execute(bot, msg) {
        await msg.reply.text("pong!")
    }
}
// SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot