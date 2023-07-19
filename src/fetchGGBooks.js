const { default: axios } = require("axios");

// Works ID
export async function fetchBookById(id) {
    let book = await fetch(`https://openlibrary.org/works/${id}.json`)
        .then(res => res.json())
        .then(data => { if (data.error) throw data.error.message; return data })
    book.author = await fetch(`https://openlibrary.org${book.authors[0].author.key}.json`).then(data => data.json()).then(data => data.name)
    return book;
}

function getAppropriateISBN(industryIdentifiers) {
    let isbnObj = industryIdentifiers ? industryIdentifiers[0]:{identifier:""}
    industryIdentifiers && industryIdentifiers.find(item => {if(item.type==="ISBN_13"){isbnObj= item}})
    return isbnObj.identifier
}

module.exports = {
    fetchBookById,
    getAppropriateISBN
}