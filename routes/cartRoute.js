const express = require('express');
const authController = require('../controller/authController');
const cartController = require('../controller/cartController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(cartController.getCart)
  .post(cartController.createCartItems);
router
  .route('/:itemId')
  .patch(cartController.updateQuantityInCart)
  .delete(cartController.removerCartItems);

module.exports = router;
