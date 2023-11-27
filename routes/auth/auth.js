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
router.post('/user/registration/Google',UserController.registrationGoogle)
router.post('/user/login', UserController.login)
router.post('/user/logout', UserController.logout)
router.get('/user/activate/:link', UserController.activate)
router.post('/user/addSubscriptions', authMiddleware, UserController.addSubscriptions)
router.get('/user/refresh', UserController.refresh)
router.post('/user/reSaveUser', authMiddleware, UserController.reSaveData)
router.get('/user/getUsers', authMiddleware, UserController.getUsers)
router.get('/user/getUser/:id', UserController.getUser)
router.get('/user/getUserId/:id', UserController.getUserId)
router.get('/user/getTopUsers', UserController.getTopUsers)
export default router;