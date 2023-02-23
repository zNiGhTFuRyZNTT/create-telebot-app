import { spawn } from 'child_process';
import path from 'path';

/** executes 'npm init -y' command in the generated project directory. */
export default async function initWorkplace(dirName, inherit, projectname = "") {
    return new Promise(resolve => {
        spawn('npm', ['init', '-y'], {
            cwd: inherit ? dirName : `${path.resolve(process.cwd())}/${projectname}/`, // <--- 
            shell: true,
            // stdio: 'inherit'
        });
        resolve(true)
    })
}