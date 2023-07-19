import {getQuery, getQueryOneOrNull} from '../database.js'
import { addTransaction } from './Transaction.js'

export async function getBooksOwnedBy(userId) {
    return getQuery(`SELECT * FROM books WHERE owned_by = ${userId}`)
}

export async function getMyBookShelf(userId) {
    return getQuery(`SELECT * FROM books WHERE owned_by = ${userId} AND for_sale=0 ORDER BY date_created DESC;`)
}

export async function getMyStoreShelf(userId) {
    return getQuery(`SELECT * FROM books WHERE owned_by = ${userId} AND for_sale=1 ORDER BY date_for_sale DESC;`)
}

// feed including everyone (not logged in)
export async function searchForSaleBooks() {
    return getQuery(`SELECT books.*, users.username as owner_username from books INNER JOIN users ON books.owned_by = users.user_id WHERE for_sale = 1 ORDER BY date_for_sale DESC;`)
}

export async function feed(userId) {
    return getQuery(`SELECT books.*, users.username as owner_username from books INNER JOIN users ON books.owned_by = users.user_id WHERE for_sale = 1 AND owned_by <> ${userId} ORDER BY date_for_sale DESC;`)
}

export async function searchForSaleBooksWithOLID(buyer_id, ol_id) {
    return getQuery(`SELECT books.*, users.username as owner_username from books INNER JOIN users ON books.owned_by = users.user_id WHERE for_sale = 1 AND ol_id = '${ol_id}' AND owned_by <> ${buyer_id} ORDER BY date_for_sale DESC;`)
}


export async function buyBook(buyer_id, book_id) {
    // TODO: create new transaction. get approval from buyers and sellers
    // when 2 have approved, ownership will be transfered
    const {seller_id} = await getQueryOneOrNull(`SELECT owned_by as seller_id FROM books WHERE book_id=${book_id}`)
    if(seller_id == buyer_id)
    {
        throw Error("Can't buy your own book")
    }
    // addTransaction(buyer_id, seller_id, book_id); // not done here
    return getQuery(`UPDATE books SET owned_by = ${buyer_id}, for_sale=0 WHERE book_id = ${book_id};`)
}

export async function addBook(forSale, ol_id, owned_by) {
    // owned by is actually the person who is signed in
    return getQuery(`INSERT INTO books (for_sale, ol_id, owned_by) VALUES (${forSale}, '${ol_id}', ${owned_by});`)
}

export async function deleteBook(user_id, book_id) {
    // owned by is actually the person who is signed in
    return getQuery(`DELETE FROM books WHERE book_id = ${book_id} AND owned_by = ${user_id};`)
}
export async function sellNewBook(ol_id, owned_by, price =0, condition) {
    // owned by is actually the person who is signed in
    return getQuery(`INSERT INTO books (owned_by, for_sale, ol_id, price, book_condition) VALUES (${owned_by}, 1, '${ol_id}', ${price}, '${condition}');`)
}

export async function sellExistBook(user_id, book_id, price=0, condition) {
    // owned by is actually the person who is signed in
    return getQuery(`UPDATE books SET price = ${price}, for_sale=1, book_condition='${condition}', date_for_sale=NOW() WHERE book_id = ${book_id} AND owned_by = ${user_id};`)
}

export async function unsellBook(user_id, book_id) {
    // owned by is actually the person who is signed in
    return getQuery(`UPDATE books SET for_sale = 0 WHERE book_id = ${book_id} AND owned_by = ${user_id}`)
}