const express = require('express');
const authController = require('../controller/authController');
const orderController = require('../controller/orderController');

const router = express.Router();

router.use(authController.protect);

router.post('/checkout-session', orderController.getCheckoutSession);
router.get('/:userId', orderController.getUserOrder);
router.get('/order/:orderId', orderController.getOrders);
router.post('/session', orderController.createOrder);
// router.get('/my-orders');

router.use(authController.restrictTo('admin'));
router.get('/', orderController.getAllOrders);

module.exports = router;
