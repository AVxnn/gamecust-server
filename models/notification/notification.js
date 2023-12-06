import mongoose from "mongoose";
const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  username: String,
  userAvatar: String,
  userId: String,
  noticifationId: String,
  title: String,
  description: String,
  status: String,
  viewed: Boolean,
});

const Notification = model("Notification", notificationSchema);
export default Notification;
