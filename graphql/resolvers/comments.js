// resolvers for comments mutations

const { UserInputError, AuthenticationError } = require('apollo-server');

const checkAuth = require('../../util/check-auth');
const Post = require('../../models/Post');

module.exports = {
    Mutation: {
        // mutation to create a new coomment
        createComment: async(_, { postId, body }, context) => {
            // authenticate user
            const { username } = checkAuth(context);
            // check if comment body is provided (else throw error)
            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                })
            }
            // find post
            const post = await Post.findById(postId);
            // add comment (most recent first)
            if (post) {
                post.comments.unshift({
                    body, 
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        },
        // mutation to delete a comment
        async deleteComment(_, { postId, commentId }, context) {
            // authenticate user
            const { username } = checkAuth(context);
            // find post by post id
            const post = await Post.findById(postId);
    
            if (post) {
                // find comment by comment id
                const commentIndex = post.comments.findIndex((c) => c.id === commentId);
                // if user has created comment, continue deleting
                if (post.comments[commentIndex].username === username) {
                    // remove comment and save post
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}