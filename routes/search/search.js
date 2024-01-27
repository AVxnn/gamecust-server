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
    });

    const usersQuery = await User.find({
      username: { $regex: q, $options: "i" }, // Найти совпадения в поле data[0].value (без учета регистра)
    });

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

export default router;
