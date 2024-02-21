import ApiError from "../exceptions/api-error.js";
import path from "path";
import { fileURLToPath } from "url";
import { v4 } from "uuid";
import * as fs from "fs";

class FileController {
  async uploadImage(req, res, next) {
    try {
      const { id } = req.body;
      const { image } = req.files;
      const __filename = fileURLToPath(import.meta.url);
      let fileName;
      const __dirname = path.dirname(__filename);
      if (image) {
        fileName = v4() + "." + image.name.match(/(png|jpg|jpeg|gif)/gm)[0];
        image.mv(path.resolve(__dirname, "..", "static", fileName));
      }
      if (process.env.PRODACTION) {
        return res.json(`${process.env.API_URL}/static/${fileName}`, image, id);
      } else {
        return res.json(`${process.env.API_URL}/static/${fileName}`, image, id);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req, res, next) {
    try {
      const { pathUrl } = req.body;
      if (pathUrl) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        fs.unlink(
          path.resolve(__dirname, "..", "static", pathUrl),
          function (err) {
            if (err) throw err;
          }
        );
        console.log("File deleted!");
        return res.json("image deleted");
      }
      return res.json("not work");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      const { id } = req.body;
      const { image } = req.files;
      console.log("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOORK", image, id);
      const __filename = fileURLToPath(import.meta.url);
      let fileName;
      const __dirname = path.dirname(__filename);
      if (image) {
        fileName =
          v4() +
          "." +
          image.name.toLowerCase().match(/(png|jpg|jpeg|gif)/gm)[0];
        image.mv(path.resolve(__dirname, "..", "avatars", fileName));
      }
      return res.json(
        `${process.env.IMAGE_URL}/avatars/${fileName}`,
        image,
        id
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteAvatar(req, res, next) {
    try {
      const { pathUrl } = req.body;
      if (pathUrl) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        fs.unlinkSync(path.resolve(__dirname, "..", "avatars", pathUrl));
        return res.json("image deleted");
      }
      return res.json("not work");
    } catch (error) {
      next(error);
    }
  }

  async uploadImage(req, res, next) {
    try {
      const { id } = req.body;
      const { image } = req.files;
      const __filename = fileURLToPath(import.meta.url);
      let fileName;
      const __dirname = path.dirname(__filename);
      if (image) {
        fileName = v4() + "." + image.name.match(/(png|jpg|jpeg|gif)/gm)[0];
        image.mv(path.resolve(__dirname, "..", "static", fileName));
      }
      if (process.env.PRODACTION) {
        return res.json(`${process.env.API_URL}/static/${fileName}`, image, id);
      } else {
        return res.json(`${process.env.API_URL}/static/${fileName}`, image, id);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req, res, next) {
    try {
      const { pathUrl } = req.body;
      if (pathUrl) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        fs.unlinkSync(path.resolve(__dirname, "..", "static", pathUrl));
        return res.json("image deleted");
      }
      return res.json("not work");
    } catch (error) {
      next(error);
    }
  }

  async uploadComment(req, res, next) {
    try {
      const { id } = req.body;
      const { image } = req.files;
      const __filename = fileURLToPath(import.meta.url);
      let fileName;
      const __dirname = path.dirname(__filename);
      if (image) {
        fileName = v4() + "." + image.name.match(/(png|jpg|jpeg|gif)/gm)[0];
        image.mv(path.resolve(__dirname, "..", "comments", fileName));
      }
      return res.json(
        `${process.env.IMAGE_URL}/comments/${fileName}`,
        image,
        id
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { pathUrl } = req.body;
      if (pathUrl) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        fs.unlinkSync(path.resolve(__dirname, "..", "comments", pathUrl));
        return res.json("image deleted");
      }
      return res.json("not work");
    } catch (error) {
      next(error);
    }
  }
}

export default new FileController();
