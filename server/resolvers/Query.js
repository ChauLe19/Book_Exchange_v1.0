const { getUserId } = require("../utils");

const defaultPageSize = 5;

async function user(root, args, context, info) {
    if (args.username)
        return context.prisma.user.findOne({
            where: {
                username: args.username
            }
        });
    return context.prisma.user.findOne({ where: { id: getUserId(context) } });
}
async function searchForSaleBook(root, args, context, info) {
    const where = {
        forSale: true,
        volumeIdGG: args.volumeIdGG
    }
    return context.prisma.book.findMany({
        where,
        orderBy: {
            dateForSale: "desc"
        }
    });
}


async function myBookShelf(root, args, context, info) {
    const results = await context.prisma.book.findMany({
        orderBy: {
            dateCreated: "desc"
        },
        take: (args.take || defaultPageSize),
        skip: (args.cursorId ? 1 : 0),
        cursor: (args.cursorId ? { id: args.cursorId } : undefined),
        where: {
            forSale: false,
            ownedBy: {
                id: getUserId(context)
            }
        },
    });
    const isNotEmpty = results.length != 0
    console.log(isNotEmpty ? results[results.length-1].id : args.cursorId)
    return {

        cursorId: isNotEmpty ? results[results.length-1].id : args.cursorId,
        isNotEmpty,
        results
    }
}
async function myStoreShelf(root, args, context, info) {
    const results = await context.prisma.book.findMany({
        orderBy: {
            dateForSale: "desc"
        },
        take: (args.take || defaultPageSize),
        skip: (args.cursorId ? 1 : 0),
        cursor: (args.cursorId ? { id: args.cursorId } : undefined),
        where: {
            forSale: true,
            ownedBy: {
                id: getUserId(context)
            }
        }
    });
    const isNotEmpty = results.length != 0

    return {
        cursorId: isNotEmpty ? results[results.length-1].id : args.cursorId,
        isNotEmpty,
        results
    }
}

async function feed(root, args, context, info) {
    const results = await context.prisma.book.findMany({
        orderBy: {
            dateForSale: "desc"
        },
        take: (args.take || defaultPageSize),
        skip: (args.cursorId ? 1 : 0),
        cursor: (args.cursorId ? { id: args.cursorId } : undefined),
        where: {
            forSale: true
        }
    });
    const isNotEmpty = results.length != 0
    console.log(isNotEmpty)
    return {
        cursorId: isNotEmpty ? results[results.length-1].id : args.cursorId,
        isNotEmpty,
        results
    };
}

// async function allTransactions(root, args,context,info){
//     return context.prisma.transaction.findMany()
// }

module.exports = {
    user,
    searchForSaleBook,
    myBookShelf,
    myStoreShelf,
    feed
}

// type Query{
//     sellingBooks(isbn: Float): [Book!]!
//     forSaleBooks: [Book!]!
//     user(username:String!): User!
//     myBookShelf: [Book!]!
//     myStoreShelf: [Book!]!
// }