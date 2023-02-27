const Database = require('../database')
const { sendLog } = require('../utils')
module.exports = {
    name: 'text', // which main event you'd like to edit the data before passing it to.
    execute(bot, data) {
        const msg = data.message
        // < - -- --- Add User to Database --- -- - >
        const username = data.message.from.username
        const firstname = data.message.from.first_name
        const lastname = data.message.from.last_name
        const userId = data.message.from.id
        const chatId = data.message.chat.id
        Database.addUser(username, firstname, lastname, userId, chatId)
            .then(() => {
                Database.updateAllSentQueries(userId)
                    .catch(err => sendLog(bot, `UserID: ${userId}\nQuery: ${msg.text}\n${JSON.stringify(err)}`))
            })
            .catch(err => sendLog(bot, `UserID: ${userId}\nQuery: ${msg.text}\n${JSON.stringify(err)}`))
        // < - -- --- --- -- - >
        bot.queries_since_start++ // increase the total sent queries since the bot has started.

        // *** Do not touch codes above unless you know what you are doing. ***
        // < - -- --- write your code bellow --- -- - >
        

        // < - -- --- End of your code --- -- - >

        data.message.isAdmin = (bot.admins.indexOf(data.message.from.id.toString()) >= 0)     // Do not TOUCH
                                                                                            // if the message is sent by a person whose id is in .env as ADMIN.
                                                                                          // you are able to access this in your command or events by "msg.isAdmin"
        return data; // Do not change
    }
}

/*
    !~  What are the modifiers?  ~!
    for example you logged message content in the text event.
    modifier for text event will allow you to manipulate the data before it being passed to the text or any other event.

    Example:

        bot.on("text", (msg) => {
            console.log(msg.text)
        })
        > if you send "hello" to your bot you'll see "hello" in the console,
        but if you add a modifier like below:

        bot.mod("text", (data) => {
            let msg = data.message;
            msg.text = `📢 ${ msg.text }`;
            retrun data
        })
        > now if you send "hello" to your bot you'll see "📢 hello" logged in the console.
        this is because the message is first passed to the modifier and the to the text event.

    
                                    !~  Caution  ~!
    > Editing the message content in here will affect the SKIP_COMMANDS_ON_TEXT behaviour,
        as each command is also treated as a text event and the behaviour you define for
        the text event will be executed on the command text at the same time with the command function itself.
    
    > Once SKIP_COMMANDS_ON_TEXT is set to "true" in .env the text event will check and skip
        the main text event function if the text message starts with any defined command name.
*/

// SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot