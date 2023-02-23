import colors from 'ansi-colors'

export default function dependencyHeaderLog(text) {
    return new Promise(resolve => {
        console.log(colors.blue(colors.green("   <-\t") + `...${text}...\t` + colors.green("->")));
        resolve()
    })
}