const express = require('express');

const router = express.Router();
const usersControllers = require('../controllers/users-controllers');
const productControllers = require('../controllers/product-Controllers');

router.get('/product/:productId',productControllers.read)
router.post('/product/create/:userId',usersControllers.requiresingin, usersControllers.isAdmin, productControllers.create);   // Test@test.com => test@test.com
router.delete('/product/:productId/:userId',usersControllers.requiresingin,usersControllers.isAdmin,productControllers.remove)
router.put('/product/:productId/:userId',usersControllers.requiresingin,usersControllers.isAdmin,productControllers.update)
router.get('/products',productControllers.list)
router.get('/products/related/:productId',productControllers.listRelated)
router.get('/products/categories',productControllers.listCategories)
router.post("/products/by/search", productControllers.listBySearch);
router.get("/products/photo/:productId", productControllers.getPhoto);


router.param('userId',usersControllers.userById);
router.param('productId',productControllers.productById);

module.exports = router;
