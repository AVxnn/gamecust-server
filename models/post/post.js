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
    tags: [],
    hashtags: [{
        type: String,
        text: String,
        color: String,
    }],
    likes: [],
    comments: [String],
    views: [String],
    viewsCount: Number,
});

const Post = model('Post', postSchema);
export default Post;