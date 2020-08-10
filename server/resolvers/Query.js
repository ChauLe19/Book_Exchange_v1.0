const { getUserId } = require("../utils");

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
        where
    });
}


async function myBookShelf(root, args, context, info) {
    return context.prisma.book.findMany({
        where: {
            forSale: false,
            ownedBy: {
                id: getUserId(context)
            }
        }
    });
}
async function myStoreShelf(root, args, context, info) {
    return context.prisma.book.findMany({
        where: {
            forSale: true,
            ownedBy: {
                id: getUserId(context)
            }
        }
    });
}

async function feed(root, args, context, info) {
    // const cursor = myCursor? 
    // console.log(myCursor)
    const result = await context.prisma.book.findMany({
        take: (-args.take||-3),
        skip:(args.cursorId?1:0),
        cursor:(args.cursorId?{id:args.cursorId}:undefined),
        where: {
            forSale: true
        }
    });
    const isNotEmpty = result.length!=0
    return {
        cursorId:isNotEmpty?result[0].id:args.cursorId,
        isNotEmpty,
        results:result.reverse()
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