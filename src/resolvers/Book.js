function ownedBy(parent,args,context,info){
    return context.prisma.book.findOne({where:{id:parent.id}}).ownedBy()
}
function transactions(parent,args,context,info){
    return context.prisma.book.findOne({where:{id:parent.id}}).transactions()
}

module.exports={
    ownedBy,
    transactions
}