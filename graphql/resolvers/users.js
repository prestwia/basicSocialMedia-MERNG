// Resolvers for user graphql queries and mutations

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

// helper function that generates json-web-token for user validation
// params: user
function generateToken(user) {
    return jwt.sign(
        {
            // include these fields in toekn
            id: user.id,
            email: user.email,
            username: user.username
        }, 
        SECRET_KEY, 
        { expiresIn: '1h' }
    );
}

module.exports = {
    Mutation: {
        // user login mutation
        // needs: username, password
        async login(
            _,
            {username, password}
        ){
            // user validation function 
            const {errors, valid} = validateLoginInput(username, password);
            // throw error if validation fails
            if(!valid){
                throw new UserInputError('Errors', { errors });
            }

            // find user in database
            const user = await User.findOne({ username });
            // throw error if username not found
            if(!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }
            // validate password 
            const match = await bcrypt.compare(password, user.password);
            // throw error if password doesn't match
            if (!match) {
                errors.general = 'Wrong Credentials';
                throw new UserInputError('Wrong credentials', { errors });
            }
            // generate json-web-token for user using user data
            const token = generateToken(user);

            return{
                ...user._doc,
                id: user._id,
                token
            }
        },
        // user registration mutation
        // needs: username, email, password, confirmPassword
        async register(
                _, 
                { registerInput: { username, email, password, confirmPassword } }, 
            ){

            // validate user data with helper function
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
              );
              // throw error if not valid
              if (!valid) {
                throw new UserInputError('Errors', { errors });
              }

            // make sure user doesn't already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            // hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            // create new user Schema
            const newUser = new User({
                email,
                username, 
                password, 
                createdAt: new Date().toISOString()
            });
            // save new user data
            const res = await newUser.save();
            // generate new token for validation
            const token = generateToken(res);

            return{
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}