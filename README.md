<br>
<br>
<p align="center">
<img src="https://camo.githubusercontent.com/4bb05e881cdc113a3645551e282f502c237c2913ce087043c267e0a6039309a9/687474703a2f2f692e696d6775722e636f6d2f65454c7a3641772e6a7067" alt="NEMESIS TEAM LOGO" style=""/>
</p>

<br>

# <p align="center">Create Telebot App</p>
## <p align="center">An even easier way to write Telegram bots</p>
### <p align="center">A cli app which generates a pre-constructed telegram bot template which uses telebot as its main module.</p>
### <p align="center"> By <a href="https://github.com/zNiGhTFuRyZNTT">NiGhTFuRy</a> </p>

<br>

## 🔨 Installation
```
npm install -g create-telebot-app
```

## 📜 DESCRIPTION
 - 📲 Advanced Telegram Bot Template generator.
 - 📲 Smart commands and event handling system.
 - 📲 Built-in Administration system.
 - 📲 Error Logging system.
 - 📲 Ready-To-Use Bot with sample commands upon set up.

<br>

---
## ❓ How to use

### First of all create a bot using <a href="https://t.me/BotFather">BotFather</a> and customize it, then copy the API_KEY

<br>

### Next execute the following commands in the terminal:
- 🖌️ `npm install -g create-telebot-app`
- 🖌️ `npx create-telebot-app` or just `create-telebot-app`
-  Now using the arrow keys select the template you'd like to create,
- Now enter a name, a directory with the name you provide will be created
and the project will be initialized inside of it. if you would like to initialize the project in the current directory just type a single dot and press Enter.
This way the program will inherit the current directory name and name the project after it, no directory will be created and everything will be set up in the current directory.
- after the setup is done navigate to the project directory and set the .env values.
- run `npm start` and enjoy 💓✨
<br>

---

####  ⚠️ Make sure the values in .env are set.
####  ⚠️ DATABASE_FILENAME and API_KEY must be set before starting and DATABASE_FILENAME must not be changd after the first time starting the script.
Example of .env: 
```
    API_KEY=5763260291:AAGATJAKr4EOc0JR2EnNETR_rYjhONrYo0U
    SKIP_COMMANDS_ON_TEXT=true
    ADMINS=111733645,111733645
    LOG_CHANNEL_ID=
    DATABASE_FILENAME=data.sqlite3
```
> ### ⚠️ DATABASE_FILENAME must not be changed!, Upon starting the bot for the first time the app will check for the DATABASE_FILENAME you provided, if exists it will use it, if not it will be created. If you change the name a new database will be created and the bot wouldn't use the previous database unless you change the name back.

    
<br>

<br>

---
# 🍽️ Templates
- `/Basic-Template` is the template without data base and administration system.
- `/Full-Template` is the template with database and admin commands pre-written.
### Each template have multiple directories such as:
* `/commands` where each command or a group of related commands will be unique to their own file, this allows the division of different commands of the bot to improve readablity and easier debugging for each command.
    - all commands must follow the same structure as bellow:
    ```js
    module.exports = {
        name: 'name_of_command', // or commands -> ['command1', 'command2']
        async execute(bot, msg, args) {
            // < -- your code here -- >
        }
    }
    ```
    note that each commands file must export a module with name and execute properties otherwise you'll run to an error.
    ### 💼 In case you need to use execute recursively you can do the following:
    ```js
        module.exports = {
        name: 'name_of_command', // or commands -> ['command1', 'command2']
        execute: async function execute(bot, msg, args) {
            // < -- your code here -- >
            // now you can call execute recursively.
        }
    }
    ```

* `/events` where each event or a group of related events will be unique to their own file.(events must be denfined in telebot, check out main telebot docs to read more about all events)
    - Events follow the same structure as commands but in `/events` you can mix events and commands together:
    ```js
        module.exports = {
        // for example you can group an event and a command together.
        // by putting a forward slash behind its name, it will be treated as a command
        name: ['text', '/say'],
        async execute(bot, msg, args) {
            // < -- your code here -- >
        }
    }
    ```


* `/modifiers` where each modifier will be defined in its own file, modifiers may affect other events or commands as they manipulate data before passing it to events or commands (read more on official telebot docs)
    - a modifier for `text` event is already defined in the Full-Template modifiers, do not touch the codes inside `modifiers/text.js` as database user handling is done inside of it. (unless you know what you are doing)

---
## 💌 NOTES
- To contact us directly join our discord server by clicking <a href="https://discord.gg/EDbPPZwu5U">Here</a>
- Any Recommendation will be appreciated, don't forget `Pull requests` if you have any idea to improve this project . 👙🤺

---

### <p align="center"> Do not HeZiTaTe to open issues if there was any problem! <br>❤️❤️❤️ </p>