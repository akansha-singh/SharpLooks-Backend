// we are using MVC structure
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const expressjwt=require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');
const {Order}=require('../models/order-model');
require('dotenv').config();




exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({users: users.map(user => user.toObject({ getters: true }))});
};









exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}

  const { name, email, password } = req.body;
  
  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  
  if (existingUser) {
    const error = new HttpError(
      'User exists already, pleasee login instead.',
      422
    );
    return next(error);
  }
  
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }
  
  const createdUser = new User({
    name,
    email,
    image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
    password:hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }


  res.status(201).json({ 
    name:createdUser.name,
    userId: createdUser.id,
    email: createdUser.email,
    about: createdUser.about,
    history:createdUser.history,
    role:createdUser.role,
    token: token
    });
};








exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials(email), could not log you in.',
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }


  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials(Password), could not log you in.',
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }


  res.json({
    name:existingUser.name,
    userId: existingUser.id,
    email: existingUser.email,
    about: existingUser.about,
    history:existingUser.history,
    role:existingUser.role,
    token: token
  });
};







exports.requiresingin=expressjwt({
  secret:process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty:"auth"
});







exports.signout = async (req, res, next) => {
  req.session.destroy(function(){
    res.json({
      message:'user logged out'
    });
  });
  res.redirect('/login');
  next();
}








exports.userById=(req, res, next,id)=>{
  User.findById(id).exec((err,user)=>{
    if(err||!user){
      const error = new HttpError(
        'UsernotFound',
        400
      );
      return next(error);
    }
    req.profile=user;
    next();
  });
};







exports.isAuth=(req,res,next)=>{
  
};







exports.isAdmin=(req,res,next)=>{
  if(req.profile.role===0){
    const error = new HttpError(
      'Only admins are allowed',
      403
    );
    return next(error);
  }
  next();
}







exports.read=(req,res,next)=>{
  req.profile.password=undefined;
  return res.json(req.profile);
};







exports.update=(req,res,next)=>{
  User.findOneAndUpdate(
    {_id:req.profile._id},{$set:req.body},{new:true},(err,user)=>{
      if(err){
        return next(
          new HttpError('YouAre not authorized', 400)
        );
      }
      user.password=undefined;
      res.json(user);
    }
  );
}









exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];

  req.body.order.products.forEach(item => {
      history.push({
          _id: item._id,
          name: item.name,
          description: item.description,
          category: item.category,
          quantity: item.count,
          transaction_id: req.body.order.transaction_id,
          amount: req.body.order.amount
      });
  });

  User.findOneAndUpdate({ _id: req.profile._id }, { $push: { history: history } }, { new: true }, (error, data) => {
      if (error) {
          return res.status(400).json({
              error: 'Could not update user purchase history'
          });
      }
      next();
  });
};




exports.purchaseHistory = (req, res) => {
  Order.find({ user: req.profile._id })
      .populate('user', '_id name')
      .sort('-created')
      .exec((err, orders) => {
          if (err) {
              return res.status(400).json({
                  error: errorHandler(err)
              });
          }
          res.json(orders);
      });
};
