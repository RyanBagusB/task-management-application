const ClientError = require('../exceptions/ClientError');

const onPreResponse = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({ status: 'fail', message: err.message });
  }

  console.log(err.message);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
};

module.exports = onPreResponse;
