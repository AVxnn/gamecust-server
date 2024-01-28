import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema({
  published: Boolean,
  publishedDate: String,
  postId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Categories",
    required: false,
  },
  data: [],
  stared: [],
  tags: [],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  comments: [],
  commentsCount: Number,
  views: [String],
  viewsCount: Number,
});

const Post = model("Post", postSchema);
export default Post;
