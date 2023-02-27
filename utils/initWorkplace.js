import { spawn } from 'child_process';
import path from 'path';

/** executes 'npm init -y' command in the generated project directory. */
export default async function initWorkplace(dirName, inherit, projectname = "") {
    return new Promise(resolve => {
        const cwd = inherit ?
            `${path.resolve(process.cwd())}` :
            `${path.resolve(process.cwd())}/${projectname}/`

        spawn('npm', ['init', '-y'], {
            cwd: cwd, // <--- 
            shell: true,
            // stdio: 'inherit'
        });
        resolve(true)
    })
}