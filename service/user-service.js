import User from '../models/user/user.js';
import bcrypt from 'bcrypt'
import {v4} from 'uuid'
import SendEmail from './mail-service.js';
import tokenService from './token-service.js';
import UserDto from '../dtos/user-dto.js';
import ApiError from '../exceptions/api-error.js';

class UserService {
    async registration(username, email, password) {
        const candidate = await User.findOne({email});
        if(candidate) {
            throw ApiError.BadRequest(`Пользователь с таким email ${email} уже существует!`)
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const activationLink = v4()
        const rating = 0
        console.log(username);
        const user = await User.create({username, rating, email, password: hashPassword, activationLink})
        await SendEmail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);

        const userDto = new UserDto(user); // id email isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken); 

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await User.findOne({activationLink})
        if(!user) {
            throw ApiError.BadRequest(`Неккоректная ссылка активации`)
        }
        user.isActivated = true;
        await user.save()

    }

    async login(email, password) {
        const user = await User.findOne({email});
        if(!user) {
            throw ApiError.BadRequest(`Пользователь с таким Email не найден`);
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals) {
            throw ApiError.BadRequest(`Неверный пароль`);
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken); 

        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken); 

        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await User.find();
        return users;
    }

    async getUser(username) {
        const user = await User.findOne({username: {$regex: new RegExp(`^${username}$`, 'i')}});
        console.log(user);
        return user;
    }
}

export default new UserService