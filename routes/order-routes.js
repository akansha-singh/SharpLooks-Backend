const express = require("express");
const router = express.Router();

const { requiresingin, isAuth, isAdmin } = require("../controllers/users-controllers");
const { userById, addOrderToUserHistory } = require("../controllers/users-controllers");
const {
    create,
    listOrders,
    getStatusValues,
    orderById,
    updateOrderStatus
} = require("../controllers/order-Controllers");
const { decreaseQuantity } = require("../controllers/product-Controllers");

router.post(
    "/order/create/:userId",
    requiresingin,
    addOrderToUserHistory,
    decreaseQuantity,
    create
);

router.get("/order/list/:userId", requiresingin, isAdmin, listOrders);
router.get(
    "/order/status-values/:userId",
    requiresingin,
    isAdmin,
    getStatusValues
);
router.put(
    "/order/:orderId/status/:userId",
    requiresingin,
    isAdmin,
    updateOrderStatus
);

router.param("userId", userById);
router.param("orderId", orderById);

module.exports = router;