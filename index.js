#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import PackageJson from '@npmcli/package-json'
import PrettyError from 'pretty-error';
import { exec, spawn } from 'child_process';

const pe = new PrettyError();
pe.start()
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
        message: 'Project name: (Enter "." to inherit from current directory)',
        validate: function (input) {
            if (/^([A-Za-z-\.\-\_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
    },
];

function main() {
    console.clear()
    inquirer.prompt(QUESTIONS)
        .then(async answers => {
            const projectChoice = answers['project-choice'];
            const projectName = answers['project-name'];
            const templatePath = `${__dirname}/templates/${projectChoice}`;
            const inherit = projectName === "."
            const dirName = path.basename(path.resolve(process.cwd()))
            const dependencies = [
                "telebot",
                "dotenv",
                "sqlite3"
            ]
            const workplaceSetUpSteps = [
                {
                    msg: "Attempting to install dependencies..."
                },
                ...dependencies.map(dependency => ({
                    cmd: `npm install ${!inherit ? `--prefix ./${projectName} ${dependency}` : dependency}`,
                    msg: `Succesfully installed ${dependency}`
                })),
                {
                    msg: "Adding start command to package.json..."
                },
            ]
            if (!inherit) {
                try {
                    fs.mkdirSync(`${CURR_DIR}/${projectName}`)
                } catch (err) {
                    return await logError(`A directory with this name already exists, please try another name.`)
                }
            }


            createDirectoryContents(templatePath, projectName, inherit)
                .then(async () => {
                    await logInfo("Finished creating files.")
                    await logInfo("Attempting to set up workplace and install the dependencies now...")
                    await initWorkplace(inherit, projectName)
                    for ( const step of workplaceSetUpSteps ) {
                        if (step.cmd)
                            await execShell(step.cmd)
                        await logInfo(step.msg)
                    }
                    setTimeout(async () => {
                        await editPkgJson({
                            scripts: {
                                test: "echo \"Error: no test specified\" && exit 1",
                                start: "node ."
                            },
                        }, inherit ? './' : `./${projectName}/`)
                    }, 1000);

                    await logInfo("Succesfully added start script.")
                    // const command = `npm install ${!inherit ? `--prefix ./${projectName}` : ''}`
                    // console.log(command);
                    // await execShell(command)
                })
                .catch(async err => {
                    console.log(err);
                    // await logError(`[>] Failed updating package.json`)
                    return pe.render(err)
                })
        })
        .catch(async err => {
            await logError("An error occurred while retrieving inputs, please try again.")
            return pe.render(err)
        })
}


function createDirectoryContents(templatePath, newProjectPath, inherit = false) {
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
                    const writePath = inherit ?
                        `${CURR_DIR}/${file}` :
                        `${CURR_DIR}/${newProjectPath}/${file}`;
                    fs.writeFileSync(writePath, contents, 'utf8');
                } else if (stats.isDirectory()) {
                    const writePath = inherit ?
                        `${CURR_DIR}/${file}` :
                        `${CURR_DIR}/${newProjectPath}/${file}`;
                    try {
                        fs.mkdirSync(writePath);
                    } catch (e) {
                        pe.render(new Error('[!] A project may seem to exist in the path specified, try another name.'));
                    }
                    // recursive call
                    createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
                }
                if (index === filesToCreate.length - 1)
                    resolve(true)
            });
        } catch (err) {
            reject(err)
        }
    })
}

function execShell(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

async function initWorkplace(inherit, projectname="") {
    return new Promise(resolve => {
        spawn('npm', ['init', '-y'], {
            cwd: inherit ? __dirname : `${path.resolve(process.cwd())}/${projectname}/`,        // <--- 
            shell: true,
            // stdio: 'inherit'
        });
        resolve(true)
    })
}
const colorsCC = {
    Reset : "\x1b[0m",
    FgBlue : "\x1b[34m",
    FgMagenta : "\x1b[35m"
}

function logError(msg) {
    return new Promise(resolve => {
        console.log("\x1b[41m Error \x1b[0m", `\x1b[31m ${msg} \x1b[0m`)
        resolve()
    })
} // TODO fix colors class and refactor the code

function logInfo(msg) {
    return new Promise(resolve => {
        console.log(colorsCC.FgMagenta + "[CTA] -> " + colorsCC.FgBlue + msg + colorsCC.Reset)
        resolve()
    })
}

async function editPkgJson(obj, path) {
    return new Promise(async (resolve, reject) => {
        const pkgJson = new PackageJson(path)
        await pkgJson.load()
        pkgJson.update(obj)
        await pkgJson.save()
        await logInfo("package.json has updated successfully.")
        resolve(true)
    })

}   

// TODO fix edit pakcage.json -> add start script
// < - -- -- Driver Code -- -- - >
main()










