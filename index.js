const { ApolloServer } = require('apollo-server');
// Apollo Dependency
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');


const server = new ApolloServer({
    cors: true, 
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }) 
});

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({ port: 5000 });
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    })