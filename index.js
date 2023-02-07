#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';


const CURR_DIR = process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [{
        name: 'project-choice',
        type: 'list',
        message: 'What project template would you like to generate?',
        choices: CHOICES
    },
    {
        name: 'project-name',
        type: 'input',
        message: 'Project name: (where to create? Enter "." to inherit from current directory)',
        validate: function (input) {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
    },
];
// TODO fix . path and other path
// TODO figure the fucking package.json

inquirer.prompt(QUESTIONS).then(answers => {
    const projectChoice = answers['project-choice'];
    const projectName = answers['project-name'];
    const templatePath = `${__dirname}/templates/${projectChoice}`;

    const inherit = templatePath === "."
    if (!inherit)
        fs.mkdirSync(`${CURR_DIR}/${projectName}`)


    createDirectoryContents(templatePath, projectName, inherit)
        .then(() => {
            
        })
        .catch(err => {
            console.error(err)
        })
});

function createDirectoryContents(templatePath, newProjectPath, inherit) {
    return new Promise((resolve, reject) => {
        const filesToCreate = fs.readdirSync(templatePath);
        // recursively copy the template directories and files
        try {
            filesToCreate.forEach((file, index) => {
                const origFilePath = `${templatePath}/${file}`;
                // get stats about the current file
                const stats = fs.statSync(origFilePath);
    
                if (file === '.npmignore') file = '.gitignore'
    
                if (stats.isFile()) {
                    const contents = fs.readFileSync(origFilePath, 'utf8');
                    const writePath = inherit
                        ? `${CURR_DIR}/${file}`
                        : `${CURR_DIR}/${newProjectPath}/${file}`;
                    fs.writeFileSync(writePath, contents, 'utf8');
                } else if (stats.isDirectory()) {
                    fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
                    // recursive call
                    createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
                }
                console.log(file);
                if (index === filesToCreate.length - 1)
                    resolve(true)
            });
        } catch (err) {
            reject(err)
        }
    })

}

function updatePackageJson(path) {

}




// // edit package.json
// if (fs.existsSync(`./${newProjectPath}/package.json`)) {
//     assert.equal(
//         set(packageJsonDataContent)
//       );
// } 
// else {
//     console.log("[!] package.json was not found! Creating and appending data...");
//     fs.appendFile('package.json', packageJsonDataContent, function (err) {
//         if (err) throw err;
//         console.log('[>] package.json was successfully created.');
//       });
// }





// const packageJsonDataContent = `{
//     "name": "${newProjectPath}",
//     "version": "1.0.0",
//     "description": "My telebot Telegram bot.",
//     "main": "main.js",
//     "scripts": {
//       "test": "echo \"Error: no test specified\" && exit 1",
//       "start": "node ."
//     },
//     "keywords": [],
//     "author": "",
//     "license": "ISC",
//     "dependencies": {
//       "dotenv": "^16.0.3",
//       "sqlite3": "^5.1.4",
//       "telebot": "^1.4.1"
//     }
//   }`