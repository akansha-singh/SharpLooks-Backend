const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const usersControllers = require('../controllers/users-controllers');
const categoryControllers = require('../controllers/category-Controllers');


router.get('/category/:categoryId',categoryControllers.read)
router.post('/category/create/:userId',[check('name').notEmpty().isLength({min:3,max:32}).withMessage("Invalid Name")],usersControllers.requiresingin,usersControllers.isAdmin,categoryControllers.create);   // Test@test.com => test@test.com
router.delete('/category/:categoryId/:userId',usersControllers.requiresingin,usersControllers.isAdmin,categoryControllers.remove)
router.put('/category/:categoryId/:userId',usersControllers.requiresingin,usersControllers.isAdmin,categoryControllers.update)
router.get('/categories',categoryControllers.getAllCategories)


router.param('categoryId',categoryControllers.categoryById);
router.param('userId',usersControllers.userById);
module.exports = router;

