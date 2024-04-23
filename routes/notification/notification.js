import express from "express";
import bodyParser from "body-parser";
import Notification from "../../models/notification/notification.js";
import dotenv from "dotenv";
dotenv.config();

import { body } from "express-validator";

const jsonParser = bodyParser.json();
const router = express.Router();

router.get("/notification/:uId", async (req, res) => {
  const { uId } = req.params;

  try {
    const notification = await Notification.find({ receiver: uId })
      .populate("user")
      .exec();
    await res.json(notification);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

router.get("/notifications/:uId/:page", async (req, res) => {
  const { uId, page } = req.params;
  const limit = 20;
  const skip = page * limit;
  try {
    const notification = await Notification.find({ receiver: uId })
      .skip(skip)
      .limit(limit)
      .sort({ publishedDate: -1 })
      .populate("user")
      .exec();
    await res.json(notification);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});
router.post("/notifications/viewed/:uId", async (req, res) => {
  const { uId } = req.params;
  try {
    console.log(uId);
    const notification = await Notification.updateMany(
      { receiver: uId }, // Условие выборки уведомлений
      { $set: { viewed: true } } // Обновление поля viewed на true
    );
    console.log(notification);
    await res.json(notification);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

router.post(`/notification/create/:uId`, async (req, res) => {
  const { uId } = req.params;
  const data = req.body;
  try {
    const notification = new Notification({
      receiver: uId,
      user: data.user,
      publishedDate: data.publishedDate,
      title: data.title,
      description: data.description || "",
      status: data.status,
      viewed: false,
    });
    await notification.save();
    await res.json(notification);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

router.post(`/notification/delete/:id`, async (req, res) => {
  const { id } = req.params;
  try {
    await Notification.deleteOne({ _id: id });
    await res.json({
      title: "Пост удален",
      Notification: Notification,
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

export default router;
