import {getQuery, getQueryOneOrNull} from '../database.js'

export async function getUserByUsername(username) {
    return getQueryOneOrNull(`SELECT * FROM users WHERE username = '${username}'`)
}

export async function getUserByEmail(email) {
    return await getQueryOneOrNull(`SELECT * FROM users WHERE email = '${email}'`)
}

export async function getUsers() {
    return getQuery(`SELECT * FROM users;`)
}

export async function createUser(user) {
    const res =  getQuery(`INSERT INTO users (email, username, password) VALUES ('${user.email}', '${user.username}', '${user.password}');`)
    console.log(res)
    return res
}