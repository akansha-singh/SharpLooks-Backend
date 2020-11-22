const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

exports.isAdmin=(req, res, next) => {
  try{
    if (req.role === 1) {
      return next();
    }
  }catch (err) {
    const error = new HttpError('Only Admins are Allowed', 401);
    return next(error);
  }
}


exports.checkAuth = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 401);
    return next(error);
  }
};


