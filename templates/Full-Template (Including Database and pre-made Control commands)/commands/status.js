const Database = require('../database')
const { sendLog } = require('../utils')
module.exports = {
    name: 'status',
    async execute(bot, msg) {
        if (msg.isAdmin)
            Database.getStatus()
            .then(async res => {
                msg.reply.text(`Users: ${res.users}\n\nMemory:\n${"\t".repeat(4)} All ${bot.queries_since_start}\n\nDatabase:\n ${"\t".repeat(4)}All ${res.all} \n`).catch(console.log)
            })
            .catch((e) => sendLog(bot, `User: ${msg.from.id}\nQuery: ${msg.query}\nError: ${JSON.stringify(e)}`))
    }
}
// SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot