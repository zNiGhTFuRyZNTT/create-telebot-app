import colors from 'ansi-colors'

export default function HeaderLog(text, arrowsAnsiColor=null) {
    if (!arrowsAnsiColor) arrowsAnsiColor = colors.green
    return new Promise(resolve => {
        console.log(colors.blue(arrowsAnsiColor("  <----") + `...${text}...` + arrowsAnsiColor("---->")));
        resolve()
    })
}