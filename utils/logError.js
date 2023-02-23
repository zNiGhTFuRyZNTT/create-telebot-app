/** logs to console a given message in a Error style. */
export default function logError(msg) {
    return new Promise(resolve => {
        console.log("\x1b[41m Error \x1b[0m", `\x1b[31m ${msg} \x1b[0m`)
        resolve()
    })
}