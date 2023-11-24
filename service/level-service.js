import jwt from 'jsonwebtoken'
import User from '../models/user/user.js';

class LevelService {
    async setExp(uid, value) {
        const user = await User.findOne({_id: uid});
        console.log(user)
        user.exp += value
        return user.save();
    }

    async delExp(uid, value) {
      const user = await User.findOne({_id: uid});
      user.exp -= value;
      return user.save();
    }

    async getExp(uid) {
      const user = await User.findOne({_id: uid});
      return user.save();
    }
}

export default new LevelService 