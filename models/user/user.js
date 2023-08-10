import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    level: {
        type: Number
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
    isActivated: {
        type: Boolean,
        default: false
    },
    activationLink: {
        type: String,
    },
    description: {
        type: String,
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