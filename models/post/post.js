import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema({
    username: String,
    userAvatar: String,
    userId: String,
    published: Boolean,
    postId: String,
    data: [],
    stared: [],
    tags: [{
        icon: String,
        title: String,
        color: String,
    }],
    images: [String],
    hashtags: [String],
    likes: [{
        username: String,
        createAt: String
    }],
    comments: [{
        username: String,
        userAvatar: String,
        createAt: String,
        content: String,
        likes: [String]
    }],
    viewsCount: Number,
});

const Post = model('Post', postSchema);
export default Post;