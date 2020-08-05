const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils');


async function signup(root, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.user.create({ data: { ...args, password } });
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return {
        token,
        user
    }
}

async function login(root, args, context, info) {
    const { password, ...user } = await context.prisma.user.findOne({ where: { email: args.email } })
    if (!user) {
        throw new Error("No such user found")
    }

    const valid = await bcrypt.compare(args.password, password)
    if (!valid) {
        throw new Error("Invalid password")
    }
    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    }
}

async function createNewBook(root, args, context, info) {
    const userId = getUserId(context)
    return context.prisma.book.create({
        data: {
            // pictures
            isbn: args.isbn,
            ownedBy: { connect: { id: userId } }
        }
    });
}
async function sellExistBook(root, args, context, info) {
    const userId = getUserId(context);
    const user = await context.prisma.user.findOne({ where: { id: userId }, select: { ownBooks: true } })
    if (!user.ownBooks.find(book => book.id == args.bookId)) {
        throw new Error("This user doesn't have this book")
    }
    return context.prisma.book.update({
        where: {
            id: parseInt(args.bookId)
        },
        data: {
            forSale: true,
            dateForSale: new Date(),
            price: args.price
        }
    });
}
async function sellNewBook(root, args, context, info) {
    const userId = getUserId(context)
    return context.prisma.book.create({
        data: {
            // pictures
            isbn: args.isbn,
            forSale: true,
            price:args.price,
            dateForSale: new Date(),
            ownedBy: { connect: { id: userId } }
        }
    });
}
async function buy(root, args, context, info) {
    const userId = getUserId(context);
    const book = await context.prisma.book.findOne({ where: { id: parseInt(args.bookId) }, select: { forSale: true, ownedBy: true,price:true } });
    if (!book.forSale) throw new Error("This book is not for sale");
    if (book.ownedBy.id===userId) throw new Error("Cannot buy your own book");
    await context.prisma.book.update({
        where: {
            id: parseInt(args.bookId)
        },
        data: {
            forSale: false,
            ownedBy: { connect: { id: userId } },
        }
    })


    return await context.prisma.transaction.create({
        data: {
            price: book.price,
            product: { connect: { id: parseInt(args.bookId) } },
            seller: { connect: { id: book.ownedBy.id } },
            buyer: { connect: { id: userId } }
        }
    })
}

async function changePassword(root, args, context, info) {
    const userId = getUserId(context)
    const { password, ...user } = await context.prisma.user.findOne({ where: { id: userId } })
    if (!user) {
        throw new Error("No such user found")
    }

    const valid = await bcrypt.compare(args.password, password)
    if (!valid) {
        throw new Error("Invalid original password")
    }

    const newHashPassword = await bcrypt.hash(args.newPassword, 10)
    const updatedUser = context.prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: newHashPassword
        }
    });
    return {
        user: updatedUser
    }
}



async function updateUserInfo(root, args, context, info) {
    const userId = getUserId(context)
    return context.prisma.user.update({
        where: {
            id: userId
        },
        data: {
            ...args
        }
    });
}


module.exports = {
    signup,
    login,
    createNewBook,
    sellExistBook,
    sellNewBook,
    buy,
    changePassword,
    updateUserInfo
}

// type Mutation{
//     signup(email:String!, name: String!, password:String!):AuthPayload
//     login(email:String!, password:String):AuthPayload
//     createNewBook(isbn: Float!):Book!
//     sellExistBook(id:ID!,price: Float!): Book!
//     sellNewBook(isbn: Float!, price:Float!): Book!
//     buy(id: ID!): Book!
//     changePassword(password:String!, newPassword:String!): User!
//     updateUserInfo(username:String): User!
// }