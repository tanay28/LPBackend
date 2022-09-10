const router = require('express').Router();
const testController = require('../controllers/testController');

const privateFunction = (req, res, next) => {
    let privateToken = req.get("authorization");
    if (privateToken == 'Tanay90') {
        next();
    } else {
        return res.status(403).json({
            status: 403,
            message: "Access Denied!!"
        });
    }
}
router.post('/decodejwt', privateFunction, testController.decodeJsonWebToken);




module.exports = router