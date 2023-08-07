import mongoose from "mongoose";
const { Schema, model } = mongoose;

const imageSchema = new Schema({
    title: String,
    description: String,
    username: String,
    userAvatar: String,
    id: String,
    data: [],
    stared: [],
    tags: [{
        icon: String,
        title: String,
        color: String,
    }],
    image: String,
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

const Image = model('Image', imageSchema);
export default Image;