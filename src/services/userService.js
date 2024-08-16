const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const InvariantError = require('../exceptions/InvariantError'); 
const NotFoundError = require('../exceptions/NotFoundError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const isNotValidId = require('../utils/isNotValidIdUtils');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

class UserService {
  async addUser({ username, password, fullname, imageName }) {
    await this.verifyNewUsername(username);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      fullname,
      imageUrl: this.getImageUrl(imageName),
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return savedUser._id;
  }

  async updateUser({ id, fullname, newImageName }) {
    const user = await this.getUserById(id);
  
    if (newImageName) {
      const oldImageName = path.basename(user.imageUrl);
      if (oldImageName !== 'undefined.png') {
        this.deleteFile(user.imageUrl);
      }
      user.imageUrl = this.getImageUrl(newImageName);
    }
  
    user.fullname = fullname || user.fullname;
  
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      fullname: user.fullname,
      imageUrl: user.imageUrl,
    }, { new: true });
  
    if (!updatedUser) {
      throw new InvariantError('User gagal diperbarui');
    }
  
    return updatedUser._id;
  }  

  async deleteUser(id) {
    const user = await this.getUserById(id);

    const imageName = path.basename(user.imageUrl);

    if (user.imageUrl && imageName !== 'undefined.png') {
      this.deleteFile(user.imageUrl);
    }

    await User.findByIdAndDelete(user._id);

    return { message: 'User berhasil dihapus' };
  }

  async getUserById(id) {
    isNotValidId(id, 'Id user tidak valid');
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError('User tidak ditemukan');
    }

    const { password, updatedAt, ...other } = user._doc;

    return other;
  }

  async verifyNewUsername(username) {
    const user = await User.findOne({ username });
    if (user) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan');
    }
  }

  async verifyUserCredential(username, password) {
    const user = await User.findOne({ username });

    if (!user) {
      throw new AuthenticationError('Username tidak ditemukan');
    }

    const { _id, password: hashedPassword } = user;

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Password anda salah');
    }

    return _id;
  }

  getImageUrl(imageUrl) {
    return `http://localhost:${PORT}/uploads/profiles/${imageUrl}`;
  }

  deleteFile(filePath) {
    try {
      const fileName = path.basename(filePath);
      const fullPath = path.join(__dirname, '../../uploads/profiles/', fileName);
      fs.unlink(fullPath, (err) => {
        if (err) throw new Error('Gagal menghapus file');
      });
    } catch (error) {
      throw new InvariantError(error.message);
    }
  }
}

module.exports = new UserService();
