import express from "express";
import mongoose from "mongoose";
import posts from "./routes/posts/posts.js";
import file from "./routes/file/file.js";
import comments from "./routes/comments/comments.js";
import level from "./routes/level/level.js";
import auth from "./routes/auth/auth.js";
import notification from "./routes/notification/notification.js";
import search from "./routes/search/search.js";
import categories from "./routes/categories/categories.js";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import schedule from "node-schedule";
import Post from "./models/post/post.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

import error from "./middleware/error/error.js";

const app = express();

const corsConfig = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(express.json());
app.use(fileUpload({}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// app.use("/static", express.static(path.join(__dirname, "static")));
// app.use("/avatars", express.static(path.join(__dirname, "avatars")));
// app.use("/comments", express.static(path.join(__dirname, "comments")));

app.use("", express.static("static"));
app.use("", express.static("avatars"));
app.use("", express.static("comments"));

app.use("/api", auth);
app.use("/api", posts);
app.use("/api", file);
app.use("/api", comments);
app.use("/api", level);
app.use("/api", notification);
app.use("/api", search);
app.use("/api", categories);
app.use(error);

app.get("/", async (req, res) => {
  res.json({
    title: "hello!",
  });
});

async function start(PORT, UrlDB) {
  try {
    console.log("Если не запускается проект, то скорее всего не включен VPN");
    await mongoose.connect(UrlDB);
    app.listen(PORT, () => console.log("server start Port", PORT));
  } catch (e) {
    console.log(e);
  }
}

const w = schedule.scheduleJob("30 * * * *", async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let posts = await Post.find({ published: true }).sort({ viewsCount: -1 });
  const result = posts.filter((post) => {
    // Получение даты публикации поста без времени
    const postDate = new Date(+post.publishedDate);
    postDate.setHours(0, 0, 0, 0);
    console.log(postDate.getTime(), today.getTime());
    return postDate.getTime() >= today.getTime();
  })[0];
  posts.map(async (post, index) => {
    if (post?.tags?.type !== "popular") {
      let data = await Post.findOneAndUpdate(
        { postId: post.postId },
        {
          tags: [],
        }
      );
    }
  });
  if (result.postId && result?.tags?.type !== "popular") {
    let data = await Post.findOneAndUpdate(
      { postId: posts[0].postId },
      {
        tags: [
          {
            type: "popular",
            text: "Популярный",
            color: "#F05353",
          },
        ],
      }
    );
  }
  if (result.postId && result?.tags?.type !== "postday") {
    let data = await Post.findOneAndUpdate(
      { postId: result.postId },
      {
        tags: [
          {
            type: "postday",
            text: "Пост дня",
            color: "#F05353",
          },
        ],
      }
    );
  }
});

const UrlDB = process.env.UrlDB;
const PORT = process.env.PORT || 4000;

start(PORT, UrlDB);
