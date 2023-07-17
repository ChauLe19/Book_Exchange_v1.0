import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import { getUserByEmail, createUser } from './User.js'
const APP_SECRET = process.env.APP_SECRET


async function isWorkValid(ol_id){
    return await fetch(`https://openlibrary.org/works/${ol_id}`)
        .then(res => res.json())
        .then(data => {if(data.error) throw data.error.message; return true})
        .catch(err => {console.log(err); return false})
}


export async function signup(userInfo) {
    const password = await bcrypt.hash(userInfo.password, 10)
    const user = { ...userInfo, password }
    await createUser(user); // TODO: check
    const token = jwt.sign({ userId: user.user_id }, APP_SECRET);
    return {
        token,
        user
    }
}

export async function login(loginEmail, loginPassword) {
    const { password, ...user } = await getUserByEmail(loginEmail) || {}
    if (Object.keys(user).length == 0) {
        throw new Error("No such user found")
    }

    const valid = await bcrypt.compare(loginPassword, password)
    if (!valid) {
        throw new Error("Invalid password")
    }
    const token = jwt.sign({ userId: user.user_id }, APP_SECRET);

    return {
        token,
        user,
    }
}

async function createNewBook(user_id, ol_id, price) {
    const userId = getUserId(context)
    const isIdValid = await isWorkValid(args.volumeIdGG)
    if(!isIdValid) throw new Error("Error has occured. This book doesn't exist.")
    // console.log(title)
    return context.prisma.book.create({
        data: {
            // pictures
            // title,
            // isbn: args.isbn,
            volumeIdGG: args.volumeIdGG,
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
async function unsell(root, args, context, info) {
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
            forSale: false,
            dateForSale: null,
            price: null
        }
    });
}

async function buy(root, args, context, info) {
    const userId = getUserId(context);
    const book = await context.prisma.book.findOne({ where: { id: parseInt(args.bookId) }, select: { forSale: true, ownedBy: true, price: true } });
    if (!book.forSale) throw new Error("This book is not for sale");
    if (book.ownedBy.id === userId) throw new Error("Cannot buy your own book");
    await context.prisma.book.update({
        where: {
            id: parseInt(args.bookId)
        },
        data: {
            forSale: false,
            price:null,
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

async function deleteBook(root, args, context, info) {
    const userId = getUserId(context);
    const book = await context.prisma.book.findOne({ where: { id: parseInt(args.bookId) }, select: { forSale: true,id:true, ownedBy: true, price: true } });
    if (book.ownedBy.id !== userId) throw new Error("Cannot delete your others' book");
    const deletedBook =  context.prisma.book.update({
        where:{
            id:book.id
        },
        data:{
            transactions:{
                connect:[]
            }
        }
    })

    return context.prisma.book.delete({where:{id:parseInt(args.bookId)}})
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


// module.exports = {
//     signup,
//     login,
//     createNewBook,
//     sellExistBook,
//     sellNewBook,
//     buy,
//     changePassword,
//     updateUserInfo,
//     unsell,
//     deleteBook
// }

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