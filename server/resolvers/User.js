async function ownBooks(parent,args,context,info){
    return await context.prisma.user.findOne({where:{id:parent.id}}).ownBooks()
}
async function sellTransactions(parent,args,context,info){
    return await context.prisma.user.findOne({where:{id:parent.id}}).sellTransactions()
}
async function buyTransactions(parent,args,context,info){
    return await context.prisma.user.findOne({where:{id:parent.id}}).buyTransactions()
}

module.exports = {
    ownBooks,
    sellTransactions,
    buyTransactions
}