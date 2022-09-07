const router = require('express').Router();
const userController = require('../controllers/UserController');

router.post('/users', userController.registerUser);





module.exports = router