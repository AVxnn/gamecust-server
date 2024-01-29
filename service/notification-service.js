import jwt from "jsonwebtoken";
import User from "../models/user/user.js";
import Notification from "../models/notification/notification.js";

class NotificationService {
  async send(title = "", description = "", status, uid, currentUserId, unic) {
    const notification = new Notification({
      receiver: uid,
      user: currentUserId,
      publishedDate: `${Date.now()}`,
      title: title,
      description: description,
      unicId: unic,
      status: status,
      viewed: false,
    });
    await notification.save();
    return "Уведомление отправлено";
  }

  async checkSendAndDelete(
    title = "",
    description = "",
    status,
    uid,
    currentUserId,
    unic
  ) {
    const notificationRes = await Notification.find({
      receiver: uid,
      user: currentUserId,
      status: status,
      unicId: unic,
    })
      .populate("user")
      .exec();
    if (notificationRes && notificationRes.length == 0) {
      const notification = new Notification({
        receiver: uid,
        user: currentUserId,
        publishedDate: `${Date.now()}`,
        title: title,
        description: description,
        unicId: unic,
        status: status,
        viewed: false,
      });
      await notification.save();
      return "Уведомление отправлено";
    } else {
      await Notification.deleteOne({
        receiver: uid,
        user: currentUserId,
        unicId: unic,
        status: status,
      });
      return "Уведомление убрано";
    }
  }

  async delete(uid, currentUserId, status, unic) {
    await Notification.deleteOne({
      receiver: uid,
      user: currentUserId,
      unicId: unic,
      status: status,
    });
    return "Уведомление убрано";
  }
}

export default new NotificationService();
