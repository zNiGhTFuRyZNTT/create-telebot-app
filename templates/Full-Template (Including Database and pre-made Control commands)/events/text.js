module.exports = {
    name: 'text',
    execute(bot, msg) {

        console.log(msg.text);


    }
}

/*
    !~  Caution  ~!
    -> Each command created in /commands direcory will be also treated as a text event!
    -> to avoid that set "SKIP_COMMANDS_ON_TEXT" to true in .env file.
    OR
    -> set "SKIP_COMMANDS_ON_TEXT" to false and handle the events behaviours manually.
    -> to see how "SKIP_COMMANDS_ON_TEXT" works, search "code_skip" in "init.js" file.
    -> 
    
*/