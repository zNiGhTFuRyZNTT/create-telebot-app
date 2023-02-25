import figlet from "figlet";
export default async function ctaWordArt() {
    return new Promise(resolve => {
        figlet('Create telebot App', function(err, data) {
            if (err) 
                reject(err)
            console.log(data)
            resolve(data)
        });
    })
}