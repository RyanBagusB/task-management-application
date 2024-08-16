const AuthenticationError = require('../exceptions/AuthenticationError');
const InvariantError = require('../exceptions/InvariantError');
const userService = require('../services/userService');
const upload = require('../utils/uploadUtils');
const fs = require('fs');
const path = require('path');

class UserController {
  async postUser(req, res, next) {
    upload(req, res, async (err) => {
      try {
        if (err) {
          throw new InvariantError(err.message);
        }
  
        const imageName = req.file ? req.file.filename : 'undefined.png';
  
        const userId = await userService.addUser({
          ...req.body,
          imageName,
        });
  
        res.status(201).json({
          status: 'success',
          message: 'User berhasil ditambahkan',
          data: {
            userId,
          },
        });
      } catch (error) {
        if (req.file) {
          fs.unlinkSync(path.join(__dirname, '../../uploads/profiles/', req.file.filename));
        }
        next(error);
      }
    });
  }

  async updateUser(req, res, next) {
    upload(req, res, async (err) => {
      try {
        if (err) {
          throw new InvariantError(err.message);
        }

        const { id } = req.decoded;

        if (id !== req.params.id) {
          throw new AuthenticationError('Akses anda tidak valid');
        }

        const imageName = req.file ? req.file.filename : undefined;

        const updatedUserId = await userService.updateUser({
          id,
          fullname: req.body.fullname,
          newImageName: imageName,
        });

        res.status(200).json({
          status: 'success',
          message: 'User berhasil diperbarui',
          data: {
            updatedUserId,
          },
        });
      } catch (error) {
        if (req.file) {
          fs.unlinkSync(path.join(__dirname, '../../uploads/profiles/', req.file.filename));
        }
        next(error);
      }
    });
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      res.json({
        status: 'success',
        data: {
          user,
        },  
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.decoded;

      
    if (id !== req.params.id) {
      throw new AuthenticationError('Akses anda tidak valid');
    }

      await userService.deleteUser(id);

      res.status(200).json({
        status: 'success',
        message: 'User berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
