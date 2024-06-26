import express from "express";
import mongoose from "mongoose";
import posts from "./routes/posts/posts.js";
import file from "./routes/file/file.js";
import comments from "./routes/comments/comments.js";
import level from "./routes/level/level.js";
import auth from "./routes/auth/auth.js";
import { createServer } from "http";
import notification from "./routes/notification/notification.js";
import search from "./routes/search/search.js";
import categories from "./routes/categories/categories.js";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import schedule from "node-schedule";
import Post from "./models/post/post.js";
import { Server } from "socket.io";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { socketPost } from "./sockets/socketPost.js";

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
const server = createServer(app);

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(express.json());
app.use(fileUpload({}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/avatars", express.static(path.join(__dirname, "avatars")));
app.use("/comments", express.static(path.join(__dirname, "comments")));

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

const io = new Server(server, {
  path: "/socket", // Указываем путь для сокетных подключений
  cors: {
    origin: process.env.CLIENT_URL, // Замените на ваш клиентский домен
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});
console.log(process.env.CLIENT_URL);
socketPost(io);

async function start(PORT, UrlDB) {
  try {
    console.log("Если не запускается проект, то скорее всего не включен VPN");
    await mongoose.connect(UrlDB);
    server.listen(PORT, () => console.log("server start Port", PORT));
  } catch (e) {
    console.log(e);
  }
}

const job = schedule.scheduleJob("25 * * * *", async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let posts = await Post.find({ published: true }).sort({ viewsCount: -1 });

  const result = posts.filter((post) => {
    // Getting the publication date of the post without time
    const postDate = new Date(+post.publishedDate);
    postDate.setHours(0, 0, 0, 0);
    return postDate.getTime() >= today.getTime();
  })[0];

  // Remove "popular" tag from all posts if they have it
  await Promise.all(
    posts.map(async (post) => {
      if (post?.tags?.some((tag) => tag.type === "popular")) {
        await Post.findOneAndUpdate(
          { postId: post?.postId },
          {
            $pull: { tags: { type: "popular" } },
          }
        );
      }
    })
  );

  // Add "popular" tag to the most viewed post if it doesn't already have it
  if (result?.postId && !result?.tags?.some((tag) => tag.type === "popular")) {
    await Post.findOneAndUpdate(
      { postId: result.postId },
      {
        $addToSet: {
          tags: {
            type: "popular",
            text: "Популярный",
            color: "#F05353",
          },
        },
      }
    );
  }

  // Add "postday" tag to the most viewed post if it doesn't already have it
  if (result?.postId && !result?.tags?.some((tag) => tag.type === "postday")) {
    await Post.findOneAndUpdate(
      { postId: result.postId },
      {
        $addToSet: {
          tags: {
            type: "postday",
            text: "Пост дня",
            color: "#F05353",
          },
        },
      }
    );
  }
});

const UrlDB = process.env.UrlDB;
const PORT = process.env.PORT || 4000;

start(PORT, UrlDB);
