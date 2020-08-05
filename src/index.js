require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();
const Query = require("./resolvers/Query")
const Mutation = require("./resolvers/Mutation")
const Book = require("./resolvers/Book")
const Transaction = require("./resolvers/Transaction")
const User = require("./resolvers/User")
const fs = require('fs');

const typeDefs = gql`${fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`;
const resolvers = {
    Query,
    Mutation,
    User,
    Book,
    Transaction
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:(request)=>{
    return {
      request:request.req,
      prisma,
    };
    }
});

server.listen({port:process.env.PORT||4000}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});