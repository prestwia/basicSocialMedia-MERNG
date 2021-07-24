const { ApolloServer } = require('apollo-server');
// Mongoose to structure mongodb data
const mongoose = require('mongoose');

//Import type definitions and resolvers for graphql to work
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers');
// Link to connect to MONGODB server
const { MONGODB } = require('./config.js');

// Start the apollo-server
const server = new ApolloServer({
    cors: true, 
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }) 
});

// Connect to MongoDB server
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        //Only start server listening if MongoDB connection successful
        return server.listen({ port: 5000 });
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    })