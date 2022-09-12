const router = require('express').Router();
const userController = require('../controllers/UserController');

router.post('/users', userController.registerUser);
router.get('/users', userController.getAllUser);
router.put('/users/activate', userController.activateUser);
router.put('/users/deactivate', userController.deactivateUser);
router.post('/users/forgotpassword', userController.forgotPassword);
router.post('/users/verifyuserotp', userController.verifyUserOtp);
router.put('/users/createnewpassword', userController.createNewPassword);


module.exports = router