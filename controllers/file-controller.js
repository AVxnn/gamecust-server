import userService from "../service/user-service.js";
import {validationResult} from 'express-validator'
import ApiError from "../exceptions/api-error.js";
import path from 'path';
import { fileURLToPath } from 'url';
import {v4} from 'uuid'
import Post from '../models/post/post.js';

class FileController {

    async uploadImage(req, res, next) {
        try {
            const {id} = req.body;
            const {image} = req.files;
            const __filename = fileURLToPath(import.meta.url);
            let fileName
            const __dirname = path.dirname(__filename);
            if (image) {
                fileName = v4() + ".jpg";
                image.mv(path.resolve(__dirname, '..', 'static', fileName))
            }
            return res.json(fileName, image, id);
        } catch (error) {
            next(error);
        }
    }

}

export default new FileController