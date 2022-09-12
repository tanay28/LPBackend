const router = require('express').Router();
const testController = require('../controllers/testController');
const logController = require('../controllers/logMonitorController');
const { validateOpenRequest } = require('../auth/request-validation');
const { checkToken } = require('../auth/Token_validation');

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
router.get('/getalllogs', validateOpenRequest, checkToken, logController.getAllLogs);




module.exports = router