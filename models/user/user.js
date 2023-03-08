import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
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
     
});

const User = model('User', userSchema);
export default User;