// resolvers for post queries and mutations

const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        // query to get all posts
        async getPosts() {
            try {
                // find and sort by newest first
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch(err) {
                throw new Error(err);
            }
        },
        // query to get specific post by postId
        async getPost(_, { postId }) {
            try{
                // find post by id
                const post = await Post.findById(postId);
                // check if post exists (else throw error)
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found')
                } 
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        // mutation to create a new post
        async createPost(_, { body }, context) {
            // authenticate user
            const user = checkAuth(context);
            // check if post body is empty
            if (args.body.trim() === '') {
                throw new Error('Post body must not be empty');
            }
            // populate new post Schema
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })
            // save new post
            const post = await newPost.save();

            return post;
        },
        // mutation to delete post by postId
        async deletePost(_, { postId }, context) {
            // authenticate user
            const user = checkAuth(context);

            try {
                // find post by id
                const post = await Post.findById(postId);
                // if the user has created post, delete (else throw error)
                if (user.username === post.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed'); 
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        // mutation to like a post
        async likePost(_, { postId }, context) {
            // authenticate user
            const { username } = checkAuth(context);
            // find post by id
            const post = await Post.findById(postId);

            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    // Post already liked -> unlike it
                    post.likes = post.likes.filter(like => like.username !== username);
                } else {
                    // not liked -> like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                // save post
                await post.save()
                return post;
            } else throw new UserInputError('Post not found');
        }
    },
}