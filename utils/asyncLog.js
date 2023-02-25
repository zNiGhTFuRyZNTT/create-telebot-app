export default async function asyncLog(text) {
    return new Promise(resolve => {
        resolve(
            console.log(text)
        )
    })
}