const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const db = new sqlite3.Database(path.join(__dirname, '/data.sqlite3'), sqlite3.OPEN_READWRITE , err => {
    if (err)
        return console.error(err.message)
    console.log("[Database] > Connected to SQLite Database")
})

// Uncomment this and run the file to create the table in case the database was deleted.
// db.run(`CREATE TABLE "users" (
// 	"id"	INTEGER NOT NULL UNIQUE,
// 	"username"	TEXT,
// 	"firstname"	TEXT,
// 	"lastname"	TEXT,
// 	"user_id"	NUMERIC NOT NULL UNIQUE,
// 	"all"	INTEGER NOT NULL DEFAULT 0,
// 	"banned"	INTEGER NOT NULL DEFAULT 0,
// 	PRIMARY KEY("id" AUTOINCREMENT)
// );`)

function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM users`, (err, users) => {
            if (err) reject(err)
            resolve(users)
        })
    })
}

function getUser(userID) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE user_id = ?`, userID, (err, user) => {
            if (err) reject(err)
            resolve(user)
        })
    })
}

function addUser(username, first_name, last_name, userID, chatID) {
    return new Promise((resolve, reject) => {
        if (userID == -1001749065212 || chatID == -1001749065212)
            resolve(false)
        else
            getUser(userID)
                .then(res => {
                    if (res) {
                        if (res.username != username || res.firstname != first_name || res.lastname != last_name)
                            db.run("UPDATE users SET username = ?, firstname = ?, lastname = ? WHERE user_id = ?", [username, first_name, last_name, userID], err => {
                                if (err) reject(err)
                                
                                resolve(true)
                            })
                        else
                            resolve(false)
                    }
                    else 
                        db.run("INSERT INTO users (username, firstname, lastname, user_id) VALUES (?, ?, ?, ?)", [username, first_name, last_name, userID], err => {
                            if (err) reject(err)
                            
                            resolve(true)
                        }) 
                })
                .catch(reject)
    })
}

function updateAll(user_id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT \"all\" FROM users WHERE user_id = ?`, user_id, (err, user) => {
            if (err) reject(err)
            
            if (user) 
                db.run("UPDATE users SET \"all\" = ? WHERE user_id = ?", [++user.all, user_id], err => {
                    if (err) reject(err)
                    resolve()
                }) 
        })
    })
}

function getStatus() {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(id) FROM users', (err, users) => {
            if (err) reject(err)

            db.get('SELECT SUM("all") FROM users', (err, all) => {
                if (err) reject(err)

                    resolve({
                        all: all['SUM("all")'],
                        users: users['COUNT(id)'],
                    })
            })
        })
    })
}

function toggleBlackList(user_id) {
    return new Promise((resolve, reject) => {
        getUser(user_id).then(user => {
            db.run(`UPDATE users SET banned = ? WHERE user_id = ?`, [user.banned ? 0 : 1, user_id], (err) => {
                if (err) reject(err)
                resolve(true)
            })
        })
    })
}

function isBanned(user_id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE user_id = ?`, user_id, (err, user) => {
            if (err) reject(err)
            resolve(user ? user?.banned : 0)
        })
    })
}

module.exports = {
    addUser: addUser,
    getUser: getUser,
    getAllUsers: getAllUsers,
    getStatus: getStatus,
    updateAll: updateAll,
    toggleBlackList: toggleBlackList,
    isBanned: isBanned,
}
