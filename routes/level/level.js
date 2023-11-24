import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import authMiddleware from '../../middleware/auth/auth.js';

import {body} from 'express-validator'
import levelController from '../../controllers/level-controller.js';

const jsonParser = bodyParser.json()
const router = express.Router()

router.post('/level/set', levelController.addExp)
router.post('/level/del', levelController.delExp)
router.get('/level/get/:uId', levelController.getExp)

export default router;