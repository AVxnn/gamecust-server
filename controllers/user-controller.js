import userService from "../service/user-service.js";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const { username, email, password } = req.body;
      const userData = await userService.registration(
        username,
        email,
        password
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async registrationGoogle(req, res, next) {
    try {
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const { username, email, picture, sub, email_verified } = req.body;
      const userData = await userService.registrationGoogle(
        username,
        email,
        picture,
        sub,
        email_verified
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return (
        res.redirect(process.env.CLIENT_URL),
        res.json({ activationLink: activationLink })
      );
    } catch (error) {
      next(error);
    }
  }

  async addSubscriptions(req, res, next) {
    try {
      const { id, uId } = req.body;
      console.log(id, uId);
      const userData = await userService.addSubscriptions(id, uId);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async reSaveData(req, res, next) {
    try {
      const { data } = req.body;
      console.log(data);
      const userData = await userService.reSaveData(data);
      
      console.log(res.json(await userData));
      return res.json(await userData);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      console.log("checkrefresh", refreshToken);
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
      console.log("userID", user);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getTopUsers(req, res, next) {
    try {
      const user = await userService.getTopUsers();
      console.log(user);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async addExpUser(req, res, next) {
    try {
      const data = req.body;
      console.log(data)
      const user = await userService.addExp(data);
      console.log(user);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async removeExpUser(req, res, next) {
    try {
      const data = req.body;
      const user = await userService.removeExp(data);
      console.log(user);
      return res.json(user);
    } catch (error) {
      next(error);
    }removeExp
  }
}

export default new UserController();
