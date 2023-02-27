const { getUser } = require('../database')
const { sendLog, sendToUser } = require('../utils')
module.exports = {
    name: 'send', // send message to a bot user using userId
    async execute(bot, msg) {
        const is_admin = (bot.admins.indexOf(msg.from.id.toString()) >= 0)
        try {
            if (is_admin) {
                const query = msg.text.split('\n')
                const user_id = query[0].split(' ')[1]
                const sender = await getUser(msg.from.id)
                query.shift()
                sendToUser(bot, msg, sender.firstname, user_id, query.join('\n'))
            }
        } catch (e) {
            sendLog(bot, `User: ${msg.from.id}\nQuery: ${msg.query}\nError: ${JSON.stringify(e)}`)
        }
    }
}
/*
* command usage:

/send <userId>
<content>

> Note: after /send specify the target userID and then write the message content in a newline.
*/
// SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot