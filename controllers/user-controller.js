import userService from "../service/user-service.js";
import {validationResult} from 'express-validator'
import ApiError from "../exceptions/api-error.js";

class UserController {

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {username, email, password} = req.body;
            const userData = await userService.registration(username, email, password);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false, secure: true });
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;

            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false, secure: true });
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async logout (req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (error) {
            next(error);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (error) {
            next(error);
        }
    }

    async addSubscriptions(req, res, next) {
        try {
            const {id, uId} = req.body;
            console.log(id, uId);
            const userData = await userService.addSubscriptions(id, uId);
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            console.log('checkrefresh', refreshToken, req?.cookies);
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false, secure: true });
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async getUser(req, res, next) {
        try {
            const id = req.params.id;
            const user = await userService.getUser(id);
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }
    async getUserId(req, res, next) {
        try {
            const id = req.params.id;
            const user = await userService.getUserId(id);
            console.log('userID', user)
            return res.json(user);
        } catch (error) {
            next(error);
        }
        
    }
}

export default new UserController