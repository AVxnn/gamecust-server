import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 0
    },
    exp: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true 
    },
    premium: {
        type: Boolean,
        required: false 
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    activationLink: {
        type: String,
    },
    description: {
        type: String,
        default: 'Измените в настройках'
    },
    private: {
        type: String,
        default: 'all'
    },
    avatarPath: {
        type: String,
    },
    bgPath: {
        type: String,
    },
    iconActive: {
        type: String,
        default: ''
    },
    icons: {
        type: Array
    },
    roles: {
        type: Array,
        default: ['user']
    },
    subscribers: {
        type: Array,
    },
    subscriptions : {
        type: Array,
    }
     
});

const User = model('User', userSchema);
export default User;