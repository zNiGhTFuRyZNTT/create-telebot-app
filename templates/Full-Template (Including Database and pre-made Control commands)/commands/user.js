const { searchUser } = require('../functions')
module.exports = {
    name: 'user', // returns the information of the specified userID from the database if present.
    async execute(bot, msg, args) {
        const is_admin = (bot.admins.indexOf(msg.from.id.toString()) >= 0)
        if (is_admin) {
            searchUser(msg, args[0])
        }
    }
}
// SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot
