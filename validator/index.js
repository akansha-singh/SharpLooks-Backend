const HttpError = require('../models/http-error');
const {check,validationResult} = require('express-validator/check');
//const {check} = require('express-validator/check');

exports.userSingupValidator=(req,res, next)=>{
    req.check('name','Name is required').notEmpty().isLength({min:3,max:32});
    req.check('name').isLength({min:3,max:32}).withMessage("Invalid Name");

    req.check('email','Invalid Email').notEmpty();
    req.check('email').matches(/.+\@.+\..+/).withMessage("Invalid Email").isLength({min:4,max:32});

    req.check('password','Password is required').notEmpty();
    req.check('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/).withMessage("Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long");

    
    next();
}
