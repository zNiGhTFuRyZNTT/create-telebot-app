/** logs a given string to the console with a defined style and color. */
import colors from 'ansi-colors'
export default function logInfo(msg) {
    return new Promise(resolve => {
        console.log("\x1b[35m" + colors.green("[CTA] |-> ") + "\x1b[34m" + msg + "\x1b[0m")
        resolve()
    })
}