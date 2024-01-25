import mongoose from "mongoose";
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  text: String,
  image: String,
  receiver: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  postId: String,
  createdAt: String,
  likes: [],
});

const Comments = model("Comments", commentSchema);
export default Comments;
