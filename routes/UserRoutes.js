const router = require('express').Router();
const userController = require('../controllers/UserController');
const { validateOpenRequest } = require('../auth/request-validation');
const { checkToken } = require('../auth/Token_validation');

router.post('/users', validateOpenRequest, userController.registerUser);
router.get('/users', validateOpenRequest, userController.getAllUser);
router.post('/users/forgotpassword', validateOpenRequest, userController.forgotPassword);
router.post('/users/verifyuserotp', validateOpenRequest, userController.verifyUserOtp);
router.put('/users/createnewpassword', validateOpenRequest, userController.createNewPassword);

router.put('/users/activate', validateOpenRequest, checkToken, userController.activateUser);
router.put('/users/deactivate', validateOpenRequest, checkToken, userController.deactivateUser);


module.exports = router;