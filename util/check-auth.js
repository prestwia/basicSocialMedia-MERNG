// Authentication function: uses the json-web-token provided during login and validates user

const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

module.exports = (context) => {
    //get token
    //context = { ... headers }
    const authHeader = context.req.headers.authorization;
    // proceed if header exists
    if (authHeader) {
        // check format
        // Bearer ....
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                // verify token and return user
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (err) {
                // throw error that token not validated
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        // throw error if incorrect format
        throw new Error("Authentication token must be \'Bearer [token]\'");
    }
    // throw error if header not provided
    throw new Error('Authorization header must be provided');
}