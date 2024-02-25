import User from "../models/user/user.js";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import SendEmail from "./mail-service.js";
import tokenService from "./token-service.js";
import Post from "../models/post/post.js";
import Comment from "../models/comment/comment.js";
import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";

class UserService {
  async registration(username, email, password) {
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с таким email ${email} уже существует!`
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const activationLink = v4();
    const rating = 0;

    const user = await User.create({
      username,
      rating,
      email,
      password: hashPassword,
      createdAt: new Date(),
      activationLink,
    });
    await SendEmail(
      email,
      `${process.env.API_URL}/api/user/activate/${activationLink}`
    );

    const userDto = new UserDto(user); // id email isActivated
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async registrationGoogle(username, email, picture, sub, email_verified) {
    const candidate = await User.findOne({ email });
    const hashPassword = await bcrypt.hash(sub, 5);
    if (candidate) {
      const isPassEquals = await bcrypt.compare(
        hashPassword,
        candidate.password
      );
      const userDto = new UserDto(candidate);
      const tokens = tokenService.generateTokens({ ...userDto });

      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      return { ...tokens, user: userDto };
    }
    const activationLink = v4();
    const rating = 0;

    const user = await User.create({
      username,
      rating,
      email,
      avatarPath: picture,
      createdAt: new Date(),
      password: hashPassword,
      activationLink: activationLink,
    });
    await SendEmail(
      email,
      `${process.env.API_URL}/api/user/activate/${activationLink}`
    );

    const userDto = new UserDto(user); // id email isActivated
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest(`Неккоректная ссылка активации`);
    }
    user.isActivated = true;
    await user.save();
  }

  async addSubscriptions(id, uId) {
    let user = await User.findOne({ _id: id });
    let uIduser = await User.findOne({ _id: uId });
    if (uIduser.subscriptions.filter((e) => e == id).length) {
      user.subscribers = user.subscribers.filter((e) => e != uId);
      uIduser.subscriptions = uIduser.subscriptions.filter((e) => e != id);
    } else {
      user.subscribers.push(uId);
      uIduser.subscriptions.push(id);
    }

    await user.save();
    await uIduser.save();
    const userDto = new UserDto(uIduser);
    return { user: userDto };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      return ApiError.BadRequest(
        `Пользователь с таким Email не найден`,
        `Пользователь с таким Email не найден`
      );
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      return ApiError.BadRequest(`Неверный пароль`, `Неверный пароль`);
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await User.find();
    return users;
  }

  async getUser(username) {
    const user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });
    return user;
  }

  async getUserId(id) {
    const user = await User.findOne({ _id: id });
    return user;
  }

  async reSaveData(data) {
    let user = await User.findOne({ _id: data.id });
    if (!user) {
      throw ApiError.BadRequest(`Неккоректный аккаунт id`);
    }
    user.description = data.description || user.description;
    user.username = data.username || user.username;
    user.iconActive = data.iconActive || user.iconActive;
    user.private = data.private || user.private;
    user.avatarPath = data.avatarPath || user.avatarPath;
    user.bgPath = data.bgPath || user.bgPath;
    const posts = await Post.find({
      userId: { $regex: new RegExp(`^${data.id}$`, "i") },
    }).sort({ publishedDate: "desc" });
    for (const post of posts) {
      await Post.findOneAndUpdate(
        { postId: post.postId },
        {
          username: data.username || user.username,
          userAvatar: data.avatarPath || user.avatarPath,
          iconActive: data.iconActive || user.iconActive,
        }
      );
    }
    const Comments = await Comment.find({
      userId: { $regex: new RegExp(`^${data.id}$`, "i") },
    });
    for (const comment of Comments) {
      await Comment.findOneAndUpdate(
        { _id: comment._id },
        {
          author: data.username || user.username,
          AvatarPath: data.avatarPath || user.avatarPath,
          iconActive: data.iconActive || user.iconActive,
        }
      );
    }
    await user.save();
    return { user: user };
  }

  async getTopUsers() {
    const users = await User.find().sort({ viewsCount: -1, publishedDate: -1 });
    const res = users.sort((item) => item.subscribers.length).slice(0, 5);
    return res;
  }

  async addExp(data) {
    // const user = await User.findById(data.id);
    // user.exp = +user.exp + +data.value;
    // await user.save();
    // return { user: user };
  }

  async removeExp(data) {
    const user = await User.findOne({ _id: data.id });
    user.exp = +user.exp - +data.value;
    await user.save();
    return { user: user };
  }
}

export default new UserService();
