import { exec } from 'child_process';
/** executes a terminal command given in the form of a string*/
export default function execShell(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        })
    })
}