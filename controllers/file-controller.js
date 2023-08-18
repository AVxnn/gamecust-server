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
                fileName = v4() + '.' + image.name.match(/(png|jpg|jpeg|gif)/mg)[0];
                image.mv(path.resolve(__dirname, '..', 'static', fileName))
            }
            return res.json(fileName, image, id);
        } catch (error) {
            next(error);
        }
    }

    async uploadAvatar(req, res, next) {
        try {
            const {id} = req.body;
            const {image} = req.files;
            const __filename = fileURLToPath(import.meta.url);
            let fileName
            const __dirname = path.dirname(__filename);
            if (image) {
                fileName = v4() + '.' + image.name.match(/(png|jpg|jpeg|gif)/mg)[0];
                image.mv(path.resolve(__dirname, '..', 'avatars', fileName))
            }
            return res.json(fileName, image, id);
        } catch (error) {
            next(error);
        }
    }

}

export default new FileController