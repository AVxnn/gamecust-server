import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categoriesSchema = new Schema({
  title: String,
  description: String,
  posts: Number,
  imagePath: String,
  bgPath: String,
  dataRelease: Number,
  subscribers: {
    type: Array,
  },
  subscriptions: {
    type: Array,
  },
});

const Categories = model("Categories", categoriesSchema);
export default Categories;
