import mysql from 'mysql2'
export const pool = mysql.createPool({
    host: 'sql9.freemysqlhosting.net',
    user: 'sql9633777',
    password: 'bMEAnTXpkL',
    database: 'sql9633777',
    port: 3306
}).promise()

export async function getQuery(query) {
    const [res, schema] = await pool.query(query)
    return res;
}

export async function getQueryOneOrNull(query) {
    const res = await getQuery(query.concat(" LIMIT 1"));
    return res.length == 0 ? null : res[0];
}