import express from 'express';
import UserController from '../../controllers/user-controller.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import authMiddleware from '../../middleware/auth/auth.js';

import {body} from 'express-validator'

const jsonParser = bodyParser.json()
const router = express.Router()

router.post('/user/registration',
    body('username').isLength({min: 3, max: 24}),  
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    UserController.registration)
router.post('/user/login', UserController.login)
router.post('/user/logout', UserController.logout)
router.get('/user/activate/:link', UserController.activate)
router.get('/user/refresh', UserController.refresh)
router.get('/user/getUsers', authMiddleware, UserController.getUsers)
router.get('/user/getUser/:id', UserController.getUser)

export default router;