import mongoose from "mongoose";
const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  receiver: String,
  publishedDate: String,
  title: String,
  description: String,
  status: String,
  viewed: Boolean,
  unicId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Notification = model("Notification", notificationSchema);

export default Notification;
