const express = require('express');
const router = express.Router();

const usersControllers = require('../controllers/users-controllers');
const braintreeControllers = require('../controllers/braintree-Controllers');


router.get('/braintree/getToken/:userId', usersControllers.requiresingin,braintreeControllers.generateToken);
router.post('/braintree/payment/:userId',function (req, res) {usersControllers.requiresignin},function (req, res) {braintreeControllers.processPayment});

router.param('userId',usersControllers.userById);
module.exports = router;
