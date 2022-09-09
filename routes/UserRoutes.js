const router = require('express').Router();
const userController = require('../controllers/UserController');

router.post('/users', userController.registerUser);
router.get('/users', userController.getAllUser);





module.exports = router