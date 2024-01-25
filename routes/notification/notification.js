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
    console.log("notification", notification);
    await res.json(notification);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

router.get("/notifications/:uId/:page", async (req, res) => {
  const { uId, page } = req.params;
  const limit = 10;
  const skip = page * limit;
  try {
    const notification = await Notification.find({ receiver: uId })
      .populate("user")
      .exec()
      .skip(skip)
      .limit(limit)
      .sort({ publishedDate: "desc" });
    console.log("notification", notification);
    await res.json(notification);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

router.post(`/notification/create/:uId`, async (req, res) => {
  const { uId } = req.params;
  const data = req.body;

  console.log("n", data, uId);
  try {
    const notification = new Notification({
      receiver: data.receiver,
      user: uId,
      publishedDate: data.publishedDate,
      title: data.title,
      description: data.description || "",
      status: data.status,
      viewed: false,
    });
    console.log("notification", notification);
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
    await Notification.deleteOne({ _id: id })
      .then(function () {
        console.log("Ntfc deleted"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
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
