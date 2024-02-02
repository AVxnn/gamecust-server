import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Post from "../../models/post/post.js";
import User from "../../models/user/user.js";
dotenv.config();

import { body } from "express-validator";

const jsonParser = bodyParser.json();
const router = express.Router();

router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const postsQuery = await Post.find({
      "data.0.value": { $regex: q, $options: "i" }, // Найти совпадения в поле data[0].value (без учета регистра)
      published: true,
    })
      .limit(10)
      .sort({ viewsCount: -1, publishedDate: -1 });

    const usersQuery = await User.find({
      username: { $regex: q, $options: "i" }, // Найти совпадения в поле data[0].value (без учета регистра)
    }).limit(5);

    res.json({
      posts: postsQuery,
      users: usersQuery,
    });
    // const user = await User.find({ receiver: uId })
    //   .populate("user")
    //   .exec()
    //   .sort({ publishedDate: "desc" });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

router.get("/search/posts/:page/:value", async (req, res) => {
  let { page, value } = req.params;
  const limit = 10;
  const skip = page * limit;
  try {
    const postsQuery = await Post.find({
      "data.0.value": { $regex: value, $options: "i" }, // Найти совпадения в поле data[0].value (без учета регистра)
      published: true,
    })
      .skip(skip)
      .limit(limit)
      .sort({ viewsCount: -1, publishedDate: -1 })
      .populate("user")
      .populate("category")
      .exec();

    res.json(postsQuery);
    // const user = await User.find({ receiver: uId })
    //   .populate("user")
    //   .exec()
    //   .sort({ publishedDate: "desc" });
  } catch (error) {
    res.status(400);
    console.log(error);
    res.json(`Error`);
  }
});

router.get("/search/users/:page/:value", async (req, res) => {
  let { page, value } = req.params;
  const limit = 10;
  const skip = page * limit;
  try {
    const usersQuery = await User.find({
      username: { $regex: value, $options: "i" }, // Найти совпадения в поле data[0].value (без учета регистра)
    })
      .skip(skip)
      .limit(limit)
      .exec();

    res.json(usersQuery);
    // const user = await User.find({ receiver: uId })
    //   .populate("user")
    //   .exec()
    //   .sort({ publishedDate: "desc" });
  } catch (error) {
    res.status(400);
    console.log(error);
    res.json(`Error`);
  }
});

export default router;
