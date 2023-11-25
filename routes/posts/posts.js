import express from "express";
import mongoose from "mongoose";
import Post from "../../models/post/post.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { v4 } from "uuid";
dotenv.config();

const jsonParser = bodyParser.json();

const router = express.Router();

// просмотр определенного поста
router.get("/post/getPost/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const post = await Post.findOne({
      postId: { $regex: new RegExp(`^${id}$`, "i") },
    });
    console.log(post);
    await res.json(post);
  } catch (error) {
    res.status(404);
    res.json(`Такой идентификатор не найден попробуйте другой`);
  }
});

router.get("/post/getPosts/filter/:filterParams/:page", async (req, res) => {
  const { filterParams, page } = req.params;
  const limit = 10;
  const skip = page * limit;
  try {
    const post = await Post.find({
      userId: { $regex: new RegExp(`^${filterParams}$`, "i") },
    })
      .skip(skip)
      .limit(limit)
      .sort({ publishedDate: "desc" });
    await res.json(post);
  } catch (error) {
    res.status(404);
    res.json(`Такой идентификатор не найден попробуйте другой`);
  }
});

router.get("/post/getPosts/rec/:page", async (req, res) => {
  let { page } = req.params;
  const limit = 10;
  const skip = page * limit;
  try {
    const post = await Post.find({ published: true })
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
router.get("/post/getPosts/:page", async (req, res) => {
  const { page } = req.params;
  const limit = 10;
  const skip = page * limit;
  try {
    const posts = await Post.find({ published: true })
      .skip(skip)
      .limit(limit)
      .sort({ publishedDate: "desc" });

    await res.json(posts);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

// Получить только опубликованные посты у пользователя
router.get("/post/getPosts/:uid/:page", async (req, res) => {
  const { uid, page } = req.params;
  const limit = 10;
  const skip = page * limit;
  try {
    const posts = await Post.find({
      userId: uid,
      published: true,
    })
      .skip(skip)
      .limit(limit)
      .sort({ publishedDate: "desc" });
    await res.json(posts);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

// создание
router.post("/post/create", jsonParser, async (req, res) => {
  const { data } = req.body;
  console.log(data);
  try {
    const article = new Post({
      title: data.title,
      description: data.description,
      username: data.username,
      userAvatar: data.userAvatar,
      iconActive: data.iconActive,
      postId: data.postId,
      data: data.data,
      stared: data.stared,
      tags: data.tags,
      images: [],
      hashtags: data.hashtags,
      likes: [],
      comments: [],
      commentsCount: 0,
      views: [],
      viewsCount: 0,
    });

    await article.save();
    res.json({
      title: "Пост создан",
      infoTitle: article,
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

// удаление
router.get("/post/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log("detele", id);
  try {
    await Post.deleteOne({ postId: { $regex: new RegExp(`^${id}$`, "i") } })
      .then(function () {
        console.log("Post deleted"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    res.status(200);
    res.json({
      title: "Пост удален",
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

// редактирование
router.post("/post/update/:id", async (req, res) => {
  const { data } = req.body;
  console.log("work", data);
  try {
    const post = await Post.findOneAndUpdate(
      { postId: data.postId },
      {
        username: data.username,
        userAvatar: data.userAvatar,
        userId: data.userId,
        iconActive: data.iconActive,
        published: data.published,
        publishedDate: data.publishedDate,
        postId: data.postId,
        data: data.data,
        stared: data.stared,
        tags: data.tags,
        hashtags: data.hashtags,
        likes: data.likes,
        comments: data.comments,
        commentsCount: data.commentsCount,
        views: data.views,
        viewsCount: data.viewsCount,
      }
    );
    if (!post) {
      const article = new Post({
        username: data.username,
        userAvatar: data.userAvatar,
        userId: data.userId,
        iconActive: data.iconActive,
        published: data.published,
        publishedDate: data.publishedDate,
        postId: data.postId,
        data: data.data,
        stared: data.stared,
        tags: data.tags,
        hashtags: data.hashtags,
        likes: [],
        comments: [],
        commentsCount: 0,
        views: [],
        viewsCount: 0,
      });
      await article.save();
      console.log("create", article);
    }
    console.log("put", post);
    res.status(200);
    res.json({
      title: "Пост обновлен",
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

// add view counter
router.get("/post/view/:id/:userId", async (req, res) => {
  const { id, userId } = req.params;
  console.log("view", id, userId);
  try {
    const postData = await Post.findOne({
      postId: id,
    });
    if (postData.views.filter((id) => id === userId).length > 0) {
      res.status(200);
      res.json({
        title: "Пост был просмотрен",
      });
      return true;
    }
    console.log(postData)
    const post = await Post.findOneAndUpdate(
      { postId: id },
      {
        views: [...postData.views, userId],
        viewsCount: postData.viewsCount + 1,
      }
    );
    console.log("put", post);
    res.status(200);
    res.json({
      title: "Пост просмотрен",
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

export default router;
