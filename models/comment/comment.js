import mongoose from "mongoose";
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  text: String,
  image: String,
  AvatarPath: String,
  author: String,
  iconActive: String,
  userId: String,
  postId: String,
  commentId: String,
  repliesId: String,
  createdAt: String,
  likes: [],
  replies: [], // Вложенные комментарии
});

const Comments = model("Comments", commentSchema);
export default Comments;
