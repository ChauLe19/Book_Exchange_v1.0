const { isTypeSystemExtensionNode } = require("graphql");

async function fetchBookById(volumeId) {
    return await fetch(`https://www.googleapis.com/books/v1/volumes/${volumeId}`)
        .then(res => res.json())
        .then(data => { if (data.error) throw data.error.message; return data })
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