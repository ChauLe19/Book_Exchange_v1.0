import mysql from 'mysql2'
export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'book_exchange'
}).promise()

export async function getQuery(query) {
    const [res, schema] = await pool.query(query)
    return res;
}

export async function getQueryOneOrNull(query) {
    const res = await getQuery(query.concat(" LIMIT 1"));
    return res.length == 0 ? null : res[0];
}