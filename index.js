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
import dependencyHeaderLog from './utils/dependencyHeaderLog.js'
import cliProgress from 'cli-progress'
import colors from 'ansi-colors'

const dependenciesBar = new cliProgress.SingleBar({
    format: colors.green('> ') + colors.blue('{bar}') + '| {percentage}% || {value}/{total} Modules',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});
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

console.clear()
inquirer.prompt(QUESTIONS)
    .then(async answers => {
        const projectChoice = answers['project-choice'];
        const projectName = answers['project-name'];
        // get the exact path of the chosen template.
        const templatePath = `${__dirname}/templates/${projectChoice}`;
        const inherit = projectName === "."

        // array below contains installation commands(npm i <pkgName>)
        // for each dependency listed in the DEPENDENCIES array. 
        const dependenciesInstallationCommands = [
            ...DEPENDENCIES.map(dependency => ({
                cmd: `npm install ${!inherit ? `--prefix ./${projectName} ${dependency}` : dependency}`,
            })), // TODO Refactor the dependency installation.
        ]
        if (!inherit) {
            // if the user chose a name, Try to create a directory with that name.
            try {
                fs.mkdirSync(`${currentDirectory}/${projectName}`)
            } catch (err) {
                return await logError(`A directory with this name already exists, please try another name.`)
            }
        }
        // copy every file and directory of the selected template.
        await createDirectoryContents(currentDirectory, templatePath, projectName, inherit)
        await logInfo("Finished creating files.")

        // execute npm init in order to setup the workplace and package.json.
        await initWorkplace(__dirname, inherit, projectName)
        await logInfo("Workplace has been set up. (npm init)")

        await dependencyHeaderLog("Installing dependencies")
        let progress = 0
        // start the progress bar with a total value of 100 and start value of 0
        dependenciesBar.start(dependenciesInstallationCommands.length, progress) 
        // install each dependencies specified in dependenciesInstallationCommands.
        for await (const step of dependenciesInstallationCommands) {
            // if the object contains a cmd property
            if (step.cmd)
                // execute its value in cmd using exec.
                await execShell(step.cmd)
            progress ++
            dependenciesBar.update(progress)
        }
        dependenciesBar.stop()
        // add start script to package.json.
        await editPkgJson({
            scripts: {
                test: "echo \"Error: no test specified\" && exit 1",
                start: "node ."
            },
        }, inherit ? './' : `./${projectName}/`)
        await logInfo("Succesfully added start script.")
    })
    .catch(async err => {
        console.log(err);
        await logError("An error occurred while retrieving inputs, please try again.")
        return pe.render(err)
    })

