const express = require('express');
const authController = require('../controller/authController');
const wishlistController = require('../controller/wishlistController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(wishlistController.getWishlist)
  .post(wishlistController.createWishlistItems);
router.delete('/:itemId', wishlistController.removerWishlistItems);

module.exports = router;
