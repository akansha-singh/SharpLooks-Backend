const express = require('express');
const {check} = require('express-validator');
const router = express.Router();
const usersControllers = require('../controllers/users-controllers');

router.post('/signup',[check('name').notEmpty().isLength({min:3,max:32}).withMessage("Invalid Name"),check('email').notEmpty().matches(/.+\@.+\..+/).withMessage("Invalid Email").isLength({min:4,max:32}),check('password').notEmpty().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/).withMessage("Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long")], usersControllers.signup);   // Test@test.com => test@test.com
router.post('/login', usersControllers.login);
router.put('/user/:userId',usersControllers.requiresingin,usersControllers.update);
router.post('/signout', usersControllers.signout);
router.get('/secret/:userId',usersControllers.requiresingin,(req,res)=>{
    res.json({user:req.profile});
});
router.get('/user/:userId',usersControllers.requiresingin,usersControllers.read);
router.put('/',usersControllers.requiresingin,usersControllers.isAdmin, usersControllers.getUsers);
router.get('/',usersControllers.getUsers);
router.get('/orders/by/user/:userId', usersControllers.requiresingin, usersControllers.purchaseHistory);

router.param('userId',usersControllers.userById);
module.exports = router;  
