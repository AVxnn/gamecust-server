import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema({
    username: String,
    userAvatar: String,
    userId: String,
    published: Boolean,
    publishedDate: String,
    postId: String,
    iconActive: String,
    data: [],
    stared: [],
    tags: [{
        type: String,
        text: String,
        color: String,
    }],
    hashtags: [{
        id: String,
        text: String,
        color: String,
    }],
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