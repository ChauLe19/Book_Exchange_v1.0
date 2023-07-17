import {getQuery} from '../database.js'

export async function addTransaction(buyer_id, seller_id, book_id) {
    // owned by is actually the person who is signed in
    return getQuery(`INSERT INTO transactions (buyer_id, seller_id, book_id) VALUES (${buyer_id}, '${seller_id}', ${book_id});`)
}