const express = require('express');
const watchController = require('./../controller/watchController');
const authController = require('./../controller/authController');
const reviewRouter = require('./reviewRoute');

const router = express.Router();

router.use('/:watchId/reviews', reviewRouter);

router.get('/', watchController.getAllWatches);

router.get('/category', watchController.getCategory);
router.get('/material', watchController.getMaterial);
router.get('/size', watchController.getSizes);

router.get('/:id', watchController.getWatch);

router.use(authController.protect, authController.restrictTo('admin'));

router.post('/', watchController.createWatch);

router
  .route('/:id')
  .patch(
    watchController.uploadWatchImages,
    watchController.resizeTourImages,
    watchController.updateWatch
  )
  .delete(watchController.deleteWatch);

module.exports = router;
