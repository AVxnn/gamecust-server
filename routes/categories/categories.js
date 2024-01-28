import express from "express";
import Categories from "../../models/categories/categories.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const jsonParser = bodyParser.json();

const router = express.Router();

router.get("/categories/:page", async (req, res) => {
  let { page } = req.params;
  const limit = 10;
  const skip = page * limit;
  try {
    const CategoriesQuery = await Categories.find({}).skip(skip).limit(limit);

    res.json(CategoriesQuery);
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

router.get("/categories/getOne/:id", async (req, res) => {
  let { id } = req.params;

  try {
    const CategoriesQuery = await Categories.findOne({
      _id: id,
    });
    res.json(CategoriesQuery);
  } catch (error) {
    res.status(400);
    console.log(error);
    res.json(`Error`);
  }
});

router.post("/categories/create", jsonParser, async (req, res) => {
  const { title, posts, imagePath, dataRelease } = req.body;
  try {
    console.log(title, posts, imagePath, dataRelease);
    const categories = new Categories({
      title: title,
      posts: posts,
      imagePath: imagePath,
      dataRelease: dataRelease,
      description: String,
      bgPath: String,
      subscribers: [],
      subscriptions: [],
    });

    await categories.save();
    res.json({
      title: "Категория создана",
      infoTitle: categories,
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

router.post("/categories/add/:id", jsonParser, async (req, res) => {
  const { id } = req.params;
  try {
    console.log(title, posts, imagePath, dataRelease);
    const CategoriesQuery = await Categories.findOne({ _id: id });
    const Categories = await Categories.findOneAndUpdate(
      { _id: id },
      { posts: CategoriesQuery + 1 }
    );
    res.json({
      title: "Добавлен пост в сообщество",
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

router.post("/categories/remove/:id", jsonParser, async (req, res) => {
  const { id } = req.params;
  try {
    console.log(title, posts, imagePath, dataRelease);
    const CategoriesQuery = await Categories.findOne({ _id: id });
    const Categories = await Categories.findOneAndUpdate(
      { _id: id },
      { posts: CategoriesQuery - 1 }
    );
    res.json({
      title: "Добавлен пост в сообщество",
    });
  } catch (error) {
    res.status(400);
    res.json(`Error`);
  }
});

export default router;
