import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema({
  userId: String,
  published: Boolean,
  publishedDate: String,
  postId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  data: [],
  stared: [],
  tags: [],
  hashtags: [
    {
      type: String,
      text: String,
      color: String,
    },
  ],
  likes: [],
  comments: [],
  commentsCount: Number,
  views: [String],
  viewsCount: Number,
});

const Post = model("Post", postSchema);
export default Post;
