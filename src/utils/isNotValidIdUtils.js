const mongoose = require('mongoose');
const InvariantError = require('../exceptions/InvariantError');

const isNotValidId = (id, message) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new InvariantError(message);
  }
}

module.exports = isNotValidId;