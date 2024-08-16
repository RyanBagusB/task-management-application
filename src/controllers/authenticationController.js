const userService = require('../services/userService');
const jwtUtils = require('../utils/jwtUtils');

class AuthenticationController {
  async postAuthentication(req, res, next) {
    try {
      const { username, password } = req.body;

      const id = await userService.verifyUserCredential(username, password);
    
      const token = jwtUtils.generateToken({ id });

      res.json({
        status: 'success',
        message: 'Login berhasil',
        data: {
          token,
        },  
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthenticationController();
