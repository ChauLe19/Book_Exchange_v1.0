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
    return context.prisma.book.findMany({
        where: {
            forSale: true,
            isbn: args.isbn
        }
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

// async function books(root,args,context,info){
//     return context.prisma.book.findMany();
// }

// async function allTransactions(root, args,context,info){
    //     return context.prisma.transaction.findMany()
    // }
    
    module.exports = {
    user,
    searchForSaleBook,
    myBookShelf,
    myStoreShelf
}

// type Query{
//     sellingBooks(isbn: Float): [Book!]!
//     forSaleBooks: [Book!]!
//     user(username:String!): User!
//     myBookShelf: [Book!]!
//     myStoreShelf: [Book!]!
// }