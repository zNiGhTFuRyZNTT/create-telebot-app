const Database = require('../database')

module.exports = {
    name: 'toggleBlackList',
    async execute(bot, msg, args) {
        if (!msg.isAdmin) return

        const blacklistTexts = {
            added: `⚠️ You have been added to the blacklist, you won't be able to use the bot anymore,
                     if you believe there was a mistake, please contact the administrator.`,
            removed: `You have been removed from the blacklist🌹`
        }
        const targetId = args[0]
        console.log(`Added to Blacklist: ${targetId}`)
        const status = await Database.toggleBlackList(targetId)

        if (status) {
            Database.getUser(targetId).then(user => {
                msg.reply.text(`User with Id ${targetId} has been ${user.banned ? 'added to' : 'removed from'} Blacklist`).then(message => {
                    bot.sendMessage(targetId, user.banned ? blacklistTexts.added : blacklistTexts.removed)
                }).catch(e => console.log(e))

            })
        }
    }
}
// SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot