module.exports = {
    // name: 'edit',
    name: ['edit', "/say"],
    async execute(bot, msg) {
        return await msg.reply.text('I saw it! You edited message!', { asReply: true });
    }
}


/* 
* No args will be passed to a command grouped with an event.
> to specify a command make sure to add a forward slash befor it such as ['edit', '/say'] .
> here "edit" will be listened on as an event and "say" as a command(user has to send /say to the bot in order for the funtion above to be executed ).
> any name specified with a "/" before it will be accesibale as a command and any with out the "/" as an event.
> event must be previously defined to the 'telebot' module before in order to work.
--> to see a list of all events etc please visit https://www.npmjs.com/package/telebot
*/