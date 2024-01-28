import express from "express";
import mongoose from "mongoose";
import Post from "../../models/post/post.js";
import User from "../../models/user/user.js";
import Categories from "../../models/categories/categories.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { v4 } from "uuid";
dotenv.config();

const jsonParser = bodyParser.json();

const router = express.Router();

// просмотр определенного поста
router.get("/post/getPost/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({
      postId: { $regex: new RegExp(`^${id}$`, "i") },
    })
      .populate("user")
      .populate("category")
      .exec();
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
      user: filterParams,
    })
      .skip(skip)
      .limit(limit)
      .sort({ publishedDate: "desc" })
      .populate("user")
      .populate("category")
      .exec();
    await res.json(post);
  } catch (error) {
    res.status(404);
    res.json(`Такой идентификатор не найден попробуйте другой`);
  }
});

router.get("/post/getPosts/category/:filterParams/:page", async (req, res) => {
  const { filterParams, page } = req.params;
  const limit = 10;
  const skip = page * limit;
  try {
    const post = await Post.find({
      published: true,
      category: filterParams,
    })
      .skip(skip)
      .limit(limit)
      .sort({ publishedDate: "desc" })
      .populate("user")
      .populate("category")
      .exec();
    await res.json(post);
  } catch (error) {
    res.status(404);
    console.log(error);
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
      .sort({ viewsCount: -1, publishedDate: -1 })
      .populate("user")
      .populate("category")
      .exec();
    await res.json(post);
  } catch (error) {
    res.status(404);
    res.json(`Такой идентификатор не найден попробуйте другой`);
  }
});

router.get("/post/getPosts/subs/:id/:page", async (req, res) => {
  let { page, id } = req.params;
  const limit = 10;
  const skip = page * limit;
  try {
    const user = await User.findById(id);
    const targetUserIds = user.subscriptions;
    const posts = await Post.find({
      userId: { $in: targetUserIds },
    })
      .skip(skip)
      .limit(limit)
      .sort({ viewsCount: -1, publishedDate: -1 })
      .populate("user")
      .populate("category")
      .exec();
    await res.json(posts);
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
      .sort({ publishedDate: "desc" })
      .populate("user")
      .populate("category")
      .exec();

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
      user: uid,
      published: true,
    })
      .skip(skip)
      .limit(limit)
      .sort({ publishedDate: "desc" })
      .populate("user")
      .populate("category")
      .exec();
    await res.json(posts);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

// создание
router.post("/post/create", jsonParser, async (req, res) => {
  const { data } = req.body;
  try {
    const post = await Post.findOneAndUpdate(
      { postId: data.postId },
      {
        published: true,
        publishedDate: `${Date.now()}`,
        user: data.user,
        category: data.category ? data.category : null,
        postId: data.postId,
        data: data.data,
        stared: data.stared,
        tags: data.tags,
        likes: data.likes,
        comments: data.comments,
        commentsCount: data.commentsCount,
        views: data.views,
        viewsCount: data.viewsCount,
      }
    );

    if (data.category) {
      const CategoriesQuery = await Categories.findOne({ _id: data.category });
      await Categories.findOneAndUpdate(
        { _id: data.category },
        { posts: +CategoriesQuery.posts + 1 }
      );
    }

    await article.save();
    res.json({
      title: "Пост создан",
      infoTitle: article,
    });
  } catch (error) {
    res.status(400);
    console.log(error);
    res.json(error.message);
  }
});

// удаление
router.get("/post/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({
      postId: { $regex: new RegExp(`^${id}$`, "i") },
    });
    await Post.deleteOne({ postId: { $regex: new RegExp(`^${id}$`, "i") } });

    if (data.category) {
      const CategoriesQuery = await Categories.findOne({ _id: data.category });
      await Categories.findOneAndUpdate(
        { _id: data.category },
        { posts: +CategoriesQuery.posts - 1 }
      );
    }

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
router.post("/post/update", async (req, res) => {
  const { data } = req.body;
  try {
    const post = await Post.findOneAndUpdate(
      { postId: data.postId },
      {
        published: data.published,
        user: data.user,
        category: data.category ? data.category : null,
        data: data.data,
        stared: data.stared,
        tags: data.tags,
        likes: data.likes,
        comments: data.comments,
        commentsCount: data.commentsCount,
        views: data.views,
        viewsCount: data.viewsCount,
      }
    );
    if (!post) {
      const article = new Post({
        user: data.user,
        category: data.category ? data.category : null,
        published: data.published,
        publishedDate: `${Date.now()}`,
        postId: data.postId,
        data: data.data,
        stared: data.stared,
        tags: data.tags,
        likes: [],
        comments: [],
        commentsCount: 0,
        views: [],
        viewsCount: 0,
      });
      await article.save();
    }
    res.status(200);
    res.json({ post });
  } catch (error) {
    res.status(400);
    console.log(error);
    res.json(`Error`);
  }
});

// add view counter
router.get("/post/view/:id/:userId", async (req, res) => {
  const { id, userId } = req.params;
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
    const oldDocument = await Post.findOne({ postId: id });
    const post = await Post.findOneAndUpdate(
      { postId: id },
      {
        views: [...postData.views, userId],
        viewsCount: postData.viewsCount + 1,
      }
    );
    res.status(200);
    res.json({
      title: "Пост просмотрен",
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

router.post("/post/like", async (req, res) => {
  const data = req.body;
  try {
    const postData = await Post.findOne({
      postId: data.postId,
    })
      .populate("user")
      .exec();
    if (
      postData?.likes?.filter(
        (likes) => new ObjectId(likes.user).valueOf() === data.user
      ).length > 0
    ) {
      const resultData = await Post.findOneAndUpdate(
        { postId: data.postId },
        {
          likes: [
            ...postData.likes.filter(
              (likes) => new ObjectId(likes.user).valueOf() !== data.user
            ),
          ],
        }
      );

      res.json({
        title: "Лайк убран",
        likes: [
          ...postData.likes.filter(
            (likes) => new ObjectId(likes.user).valueOf() !== data.user
          ),
        ],
      });
      return null;
    } else {
      const resultData = await Post.findOneAndUpdate(
        { postId: data.postId },
        {
          likes: [...postData.likes, { user: data.user }],
        }
      )
        .populate("user")
        .populate("category")
        .exec();
      res.status(200);
      res.json({
        title: "Лайк поставлен",
        likes: [...postData.likes, { user: data.user }],
      });
    }
  } catch (error) {
    res.status(400);
    console.log(error);
    res.json(`Error`);
  }
});

export default router;
