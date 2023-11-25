import express from "express";
import mongoose from "mongoose";
import Comment from "../../models/comment/comment.js";
import Post from "../../models/post/post.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { v4 } from "uuid";
dotenv.config();

const jsonParser = bodyParser.json();

const router = express.Router();

// просмотр определенного поста
router.get("/comment/getComment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Comment.findOne({
      postId: { $regex: new RegExp(`^${id}$`, "i") },
    });
    console.log("comments", id);
    await res.json(post);
  } catch (error) {
    res.status(404);
    res.json(`Такой идентификатор не найден попробуйте другой`);
  }
});

router.get("/comment/getComments/user/:page", async (req, res) => {
  let { page } = req.params;
  const limit = 10;
  const skip = page * limit;
  try {
    const post = await Comment.find({ published: true })
      .skip(skip)
      .limit(limit)
      .sort({ viewsCount: -1, publishedDate: -1 });
    await res.json(post);
  } catch (error) {
    res.status(404);
    res.json(`Такой идентификатор не найден попробуйте другой`);
  }
});

// просмотр всех постов
router.get("/comment/getComments/:postid", async (req, res) => {
  const { postid } = req.params;
  try {
    const posts = await Comment.find({ postId: postid }).sort();

    await res.json(posts);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

// создание
router.post("/comment/create", jsonParser, async (req, res) => {
  const { data } = req.body;
  console.log("comment", data);
  try {
    const postData = await Post.findOne({
      postId: data.postId,
    });
    console.log('test 1', postData)
    const article = new Comment({
      text: data.text,
      image: data.image,
      author: data.author,
      AvatarPath: data.avatarPath,
      userId: data.userId,
      postId: data.postId,
      repliesId: data.repliesId,
      commentId: data.commentId,
      createdAt: `${Date.now()}`,
      likes: [],
      replies: [],
    });

    console.log('test 2', article)
    const post = await Post.findOneAndUpdate(
      { postId: data.postId },
      {
        comments: [...postData.comments, data.commentId],
        commentsCount: postData.commentsCount + 1,
      }
    );

    console.log('test 3', post)
    await article.save();
    res.json({
      title: "Комментарий создан",
      infoTitle: article,
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

// ответ
router.post("/comment/reply", jsonParser, async (req, res) => {
  const { data } = req.body;
  console.log("comment", data);
  try {
    const postData = await Post.findOne({
      postId: data.postId,
    });
    const article = new Comment({
      text: data.text,
      image: data.image,
      author: data.author,
      AvatarPath: data.avatarPath,
      userId: data.userId,
      postId: data.postId,
      repliesId: data.repliesId,
      commentId: data.commentId,
      createdAt: `${Date.now()}`,
      likes: [],
      replies: [],
    });
    const post = await Post.findOneAndUpdate(
      { postId: data.postId },
      {
        comments: [
          ...postData.comments,
          { commentId: data.commentId, repliesId: data.repliesId },
        ],
        commentsCount: postData.commentsCount + 1,
      }
    );

    await article.save();
    res.json({
      title: "Комментарий отвечен",
      infoTitle: article,
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

// удаление
router.post("/comment/delete/:id", async (req, res) => {
  const { data } = req.body;
  console.log("detele", id);
  try {
    const postData = await Post.findOne({
      postId: data.postId,
    });
    const newComments = postdata.comments.filter((id) => id !== data.commentId)
    await Comment.deleteOne({ postId: { $regex: new RegExp(`^${id}$`, "i") } })
      .then(function () {
        console.log("Post deleted"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
    const post = await Post.findOneAndUpdate(
      { postId: data.postId },
      {
        comments: [
          ...newComments,
        ],
        commentsCount: postData.commentsCount - 1,
      }
    );
    res.status(200);
    res.json({
      title: "Комментарий удален",
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

// редактирование
router.post("/comment/update/:id", async (req, res) => {
  const { data } = req.body;
  console.log("work", data);
  try {
    const post = await Comment.findOneAndUpdate(
      { postId: data.postId },
      {
        text: data.text,
        image: data.image,
        author: data.author,
        AvatarPath: data.avatarPath,
        userId: data.userId,
        createdAt: data.createdAt,
        commentId: data.commentId,
        likes: [],
        replies: [],
      }
    );
    if (!post) {
      const article = new Comment({
        text: data.text,
        image: data.image,
        author: data.author,
        AvatarPath: data.avatarPath,
        userId: data.userId,
        createdAt: data.createdAt,
        commentId: data.commentId,
        likes: [],
        replies: [],
      });
      await article.save();
      console.log("create", article);
    }
    console.log("put", post);
    res.status(200);
    res.json({
      title: "Комментарий обновлен",
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

export default router;
