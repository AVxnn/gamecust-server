import levelService from "../service/level-service.js";

class LevelController {

  async addExp(req, res, next) {
    try {
      const { uId, value } = req.body;
      const userData = await levelService.setExp(uId, value);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async delExp(req, res, next) {
    try {
      const { uId, value } = req.body;
      const userData = await levelService.delExp(uId, value);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async getExp(req, res, next) {
    try {
      const uId = req.params.uId;
      const userData = await levelService.getExp(uId);
      return res.json(userData.exp);
    } catch (error) {
      next(error);
    }
  }
}

export default new LevelController();
