const router = require('express').Router();
const userController = require('../controllers/UserController');
const { validateOpenRequest } = require('../auth/request-validation');

router.post('/users', validateOpenRequest, userController.registerUser);
router.get('/users', validateOpenRequest, userController.getAllUser);
router.put('/users/activate', validateOpenRequest, userController.activateUser);
router.put('/users/deactivate', validateOpenRequest, userController.deactivateUser);
router.post('/users/forgotpassword', validateOpenRequest, userController.forgotPassword);
router.post('/users/verifyuserotp', validateOpenRequest, userController.verifyUserOtp);
router.put('/users/createnewpassword', validateOpenRequest, userController.createNewPassword);


module.exports = router;