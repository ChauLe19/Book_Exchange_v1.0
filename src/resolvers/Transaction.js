function product(parent,args,context,info){
    return context.prisma.transaction.findOne({where:{id:parent.id}}).product()
}
function seller(parent,args,context,info){
    return context.prisma.transaction.findOne({where:{id:parent.id}}).seller()
}
function buyer(parent,args,context,info){
    return context.prisma.transaction.findOne({where:{id:parent.id}}).buyer()
}

module.exports = {
    product,
    seller,
    buyer
}