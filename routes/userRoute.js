const express = require('express');
const authController = require('./../controller/authController');
const userController = require('./../controller/userController');

const router = express.Router();

router.post('/signup', authController.signupUser);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserImage,
  userController.resizeUserImage,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);
router.post('/createUser', userController.createUser);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
