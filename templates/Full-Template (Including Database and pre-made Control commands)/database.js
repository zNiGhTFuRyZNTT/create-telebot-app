const sqlite3 = require('sqlite3').verbose()
require("dotenv").config();
const databaseName = process.env.DATABASE_FILENAME
const db = initDatabase(databaseName)

function initDatabase(filename) {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, async (err) => {
        if (err) console.log(err)
        await createTables(db)
    })
    console.log("[sqlite3] Connected to Database.")
    return db
}

function createTables(db) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.run(`CREATE TABLE IF NOT EXISTS "users" (
                "id"	INTEGER NOT NULL UNIQUE,
                "username"	TEXT,
                "firstname"	TEXT,
                "lastname"	TEXT,
                "user_id"	NUMERIC NOT NULL UNIQUE,
                "all"	INTEGER NOT NULL DEFAULT 0,
                "banned"	INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY("id" AUTOINCREMENT)
            );`)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

// get all users who had sent queries to the bot since the db was created.
function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM users`, (err, users) => {
            if (err) reject(err)
            resolve(users)
        })
    })
}

// get information of a specific user in the database if exists.
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
                } else
                    db.run("INSERT INTO users (username, firstname, lastname, user_id) VALUES (?, ?, ?, ?)", [username, first_name, last_name, userID], err => {
                        if (err) reject(err)

                        resolve(true)
                    })
            })
            .catch(reject)
    })
}

function updateAllSentQueries(user_id) {
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
    updateAllSentQueries: updateAllSentQueries,
    toggleBlackList: toggleBlackList,
    isBanned: isBanned,
}