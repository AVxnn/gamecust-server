import express from 'express';
import FileController from '../../controllers/file-controller.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import authMiddleware from '../../middleware/auth/auth.js';

import {body} from 'express-validator'

const jsonParser = bodyParser.json()
const router = express.Router()

router.post('/file/upload', FileController.uploadImage)
// router.post('/user/delete', FileController.logout)

export default router;