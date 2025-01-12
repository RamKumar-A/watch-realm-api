const express = require('express');
const brandController = require('./../controller/brandController');
const authController = require('./../controller/authController');

const router = express.Router();

router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrand);

router.use(authController.protect, authController.restrictTo('admin'));

router.post('/', brandController.createBrand);
router
  .route('/:id')
  .patch(
    brandController.uploadBrandLogo,
    brandController.resizeBrandLogo,
    brandController.updateBrand
  )
  .delete(brandController.deleteBrand);

module.exports = router;
