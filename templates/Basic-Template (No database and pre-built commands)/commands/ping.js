module.exports = {
    name: 'ping', // send message to a bot user using userId
    async execute(bot, msg) {
        await msg.reply("pong!")
    }
}
/*
    > Note: after /send specify the target userID and then write the message content in a newline.
*/
// SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot