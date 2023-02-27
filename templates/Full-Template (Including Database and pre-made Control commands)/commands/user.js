const { searchUser } = require('../utils')
module.exports = {
    name: 'user', // returns the information of the specified userID from the database if present.
    async execute(bot, msg, args) {
        if (!msg.isAdmin)
            return
            
        searchUser(msg, args[0])
    }
}
// SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot
