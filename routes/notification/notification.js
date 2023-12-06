import express from 'express';
import bodyParser from 'body-parser';
import Notification from "../../models/notification/notification.js";
import dotenv from 'dotenv';
dotenv.config();

import {body} from 'express-validator'

const jsonParser = bodyParser.json()
const router = express.Router()

router.get('/notification/:uId', async (req, res) => {
  const { uId } = req.params;

  try {
    const notification = await Notification.find({ userId: uId })
    console.log('notification', notification)
    await res.json(notification);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

router.post(`/notification/create/:uId`, async (req, res) => {
  const { uId } = req.params;
  const data = req.body;
  
  console.log("n", data, uId)
  try {
    const notification = new Notification({
      username: data.username,
      userAvatar: data.userAvatar,
      sendUserId: data.sendUserId,
      userId: uId,
      noticifationId: data.noticifationId,
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

export default router;