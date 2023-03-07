import fs from 'fs'
import PrettyError from 'pretty-error';
const pe = new PrettyError().start()

/** copies the every file of the chosen template to the path specified. */
export default function createDirectoryContents(currentDirectory, templatePath, newProjectPath, inherit = false) {
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
                        `${currentDirectory}/${file}` :
                        `${currentDirectory}/${newProjectPath}/${file}`;
                    fs.writeFileSync(writePath, contents, 'utf8');
                } else if (stats.isDirectory()) {
                    const writePath = inherit ?
                        `${currentDirectory}/${file}` :
                        `${currentDirectory}/${newProjectPath}/${file}`;
                    try {
                        fs.mkdirSync(writePath);
                    } catch (e) {
                        pe.render(new Error('[!] A project may seem to exist in the path specified, try another name.'));
                    }
                    // recursive call
                    createDirectoryContents(currentDirectory, `${templatePath}/${file}`, `${newProjectPath}/${file}`);
                }
                if (index === filesToCreate.length - 1)
                    resolve(true)
            });
        } catch (err) {
            reject(err)
        }
    })
}
