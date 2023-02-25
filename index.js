#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import PrettyError from 'pretty-error';
import logError from './utils/logError.js';
import logInfo from './utils/logInfo.js'
import editPkgJson from './utils/editPkgJson.js';
import execShell from './utils/execShell.js'
import initWorkplace from './utils/initWorkplace.js'
import createDirectoryContents from './utils/createDirectoryContents.js'
import HeaderLog from './utils/HeaderLog.js'
import asyncLog from './utils/asyncLog.js';
import cliProgress from 'cli-progress'
import colors from 'ansi-colors'
import ctaWordArt from './utils/ctaWordArt.js'
import checkInternetConnected from 'check-internet-connected';

const dependenciesBar = new cliProgress.SingleBar({
    format: colors.green('> ') + colors.blue('{bar}') + '| {percentage}% || {value}/{total} Modules',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
}, cliProgress.Presets.legacy);
const pe = new PrettyError().start()
const currentDirectory = process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHOICES = fs.readdirSync(`${__dirname}/templates`);
const DEPENDENCIES = [
    "telebot",
    "dotenv",
    "sqlite3"
]
const QUESTIONS = [{
        name: 'project-choice',
        type: 'list',
        message: 'What project template would you like to generate?',
        choices: CHOICES
    },
    {
        name: 'project-name',
        type: 'input',
        message: 'Project name: (Enter "." to inherit from current directory)',
        validate: function (input) {
            if (/^([A-Za-z-\.\-\_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
    },
];


(async () => {
    console.clear()
    await asyncLog(colors.yellow("Checking internet connection..."))
    try {
        await checkInternetConnected()
    } catch {
        console.clear()
        await logError("No internet! you need internet connectivity to use this app.")
        process.exit()
    }
    console.clear()
    inquirer.prompt(QUESTIONS)
        .then(async answers => {
            const projectChoice = answers['project-choice'];
            const projectName = answers['project-name'];
            // get the exact path of the chosen template.
            const templatePath = `${__dirname}/templates/${projectChoice}`;
            const inherit = projectName === "."
            // the array below contains a few steps of the set up.
            // each step must have a property named msg to be logged to the console.
            // a cmd property is optional and the value assined to it will be executed,
            // before logging the value of the msg property of the object.
            const workplaceSetUpSteps = [
                ...DEPENDENCIES.map(dependency => ({
                    cmd: `npm install ${!inherit ? `--prefix ./${projectName} ${dependency}` : dependency}`,
                    msg: `Succesfully installed ${dependency}`
                })),
            ]
            const usageSteps = [
                "Create a bot in Botfather bot in Telegran.",
                "Configure the settings in .env",
                "run npm start",
            ]
            if (!inherit) {
                // if the user chose a name, Try to create a directory with that name.
                try {
                    fs.mkdirSync(`${currentDirectory}/${projectName}`)
                } catch (err) {
                    return await logError(`A directory with this name already exists, please try another name.`)
                }
            }

            // word art of create-telebot-app
            await ctaWordArt()
            // copy every file and directory of the selected template.
            await createDirectoryContents(currentDirectory, templatePath, projectName, inherit)
            await logInfo("Finished creating files.")

            // execute npm init in order to setup the workplace and package.json.
            await initWorkplace(__dirname, inherit, projectName)
            await logInfo("Workplace has been set up. (npm init)")

            await HeaderLog("Installing dependencies")
            let progress = 0
            dependenciesBar.start(workplaceSetUpSteps.length, progress) // start the progress bar with a total value of 100 and start value of 0
            // install each dependencies specified in workplaceSetUpSteps.
            for await (const step of workplaceSetUpSteps) {
                if (step.cmd) // if the object contains a cmd property
                    await execShell(step.cmd) // execute its value in cmd using exec.
                // await logInfo(step.msg) // log to console the msg value of the object.
                progress++
                dependenciesBar.update(progress)
            }
            dependenciesBar.stop()
            await logInfo("Succesfully installed dependencies.")

            // add start script to package.json.
            await editPkgJson({
                scripts: {
                    test: "echo \"Error: no test specified\" && exit 1",
                    start: "node ."
                },
            }, inherit ? './' : `./${projectName}/`)

            await logInfo("Succesfully added start script.")
            await HeaderLog("| Finished generating template |")
            await HeaderLog(`|${" ".repeat(12)}Usage:${" ".repeat(12)}|`, colors.magenta)
            // logging to console instructions to start the generated bot.
            // all instructions are listed inside of usageSteps.
            usageSteps.forEach(async text => {
                await asyncLog(colors.magenta("> ") + colors.cyan(text))
            })
        })
        .catch(async err => {
            console.log(err);
            await logError("An error occurred, please try again.")
            return pe.render(err)
        })
})()