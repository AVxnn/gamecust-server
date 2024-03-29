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
router.post('/file/deleteupload', FileController.deleteImage)
router.post('/file/uploadComment', FileController.uploadComment)
router.post('/file/deleteComment', FileController.deleteComment)
router.post('/file/uploadAvatar', FileController.uploadAvatar)
router.post('/file/deleteAvatar', FileController.deleteAvatar)

export default router;