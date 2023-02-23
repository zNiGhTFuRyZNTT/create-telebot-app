const fs = require('fs');
require("dotenv").config();

module.exports = {
    init: (bot) => {

        const getModules = (dirPath) => {
            const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'))
            for (let i = 0; i < files.length; i++) {
                files[i] = files[i].slice(0, -3);
            }
            return files
        }

        const loadModules = (filesArray, dirName) => {
            filesArray.forEach(filename => {
                const event = require(`./${dirName}/${filename}`)
                const eventNames = Array.isArray(event.name) ?
                    event.name.map(value => typeof value == "object" ? JSON.stringify(value) : value) :
                    event.name

                bot[dirName].set(event.name, event.execute)
                console.log(`[bot.event] loaded '${eventNames}' ${dirName.slice(0, -1)}`);
            })
        }

        const activateModules = (moduleMap, type = "event") => {
            moduleMap.forEach(async (exec, name) => {
                switch (type) {
                    case "cmd": // Commands
                        let cmd = Array.isArray(name) ?
                            name.map(name => name !== "start" ? new RegExp(`${name}(.*)`) : /\/start(.*)/) :
                            new RegExp(name !== "start" ? `${name}(.*)` : /\/start(.*)/)

                        bot.on(cmd, async (data, props) => {
                            /* 
                            the reason I had to manually get arguments was that using regex
                            you can only access deep linking arguments passed to start. and
                            any other arguments such as "/start this_text" won't be acessed by regex.
                            */
                            if (data.text === '/start') {
                                return exec(bot, data, ["empty", props])
                            } 
                            else if (data.text.includes("/start") && data.text.trim().length > 6) {
                                const props2 = data.text.split(" ").shift();
                                return exec(bot, data, props2)
                            }

                            const args = props ? props.match[1].trim().split(" ") : ["empty"]
                            return exec(bot, data, args)
                        })
                        break;

                    case "event":
                        const events = [name].flat(1)
                        events.forEach(event => {
                            bot.on(event, (data) => {
                                if (name === "text" && process.env.SKIP_COMMANDS_ON_TEXT === "true") {
                                    const bannedCommands = [...bot.commands.keys()].flat(1).map(cmd => "/" + cmd)
                                    if (bannedCommands.some((cmd => data.text.startsWith(cmd)))) return
                                }
                                return exec(bot, data)
                            })
                        })
                        break;

                    case "mod":
                        bot.mod(name, (data) => {
                            return exec(bot, data)
                        })
                        break;
                }
            })
        }

        bot.events = new Map()
        bot.modifiers = new Map()
        bot.commands = new Map()

        const modules = [{
                name: 'events',
                files: getModules('./events/')
            },
            {
                name: 'modifiers',
                files: getModules('./modifiers/')
            },
            {
                name: 'commands',
                files: getModules('./commands/')
            },
        ]

        // < -- --- - Load/Import modules - --- -- >
        modules.forEach(mod => {
            loadModules(mod.files, mod.name)
        })
        // < -- --- - run listeners on each module - --- -- >
        activateModules(bot.events)
        activateModules(bot.modifiers, "mod")
        activateModules(bot.commands, "cmd")

        // < -- --- - Other requirememts -- --- - >
        bot.admins = process.env.ADMINS.split(',').filter(adminId => adminId !== '')
        bot.queries_since_start = 0

    }
}

// SEE MORE INFORMATION AT : 🌐 https://github.com/mullwar/telebot