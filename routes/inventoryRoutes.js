const router = require('express').Router();
const inventoryController = require('../controllers/inventoryController');
const { validateOpenRequest } = require('../auth/request-validation');
const { checkToken } = require('../auth/Token_validation');

router.post('/quality', validateOpenRequest, checkToken, inventoryController.addQuality);
router.get('/quality', validateOpenRequest, checkToken, inventoryController.getAllQuality);
router.get('/quality/:id', validateOpenRequest, checkToken, inventoryController.getQualitybyId);
router.put('/quality/:id', validateOpenRequest, checkToken, inventoryController.modifyQuality);
router.delete('/quality/:id', validateOpenRequest, checkToken, inventoryController.removeQuality);

router.post('/producttype', validateOpenRequest, checkToken, inventoryController.addProductType);
router.get('/producttype', validateOpenRequest, checkToken, inventoryController.getAllProductType);
router.get('/producttype/:id', validateOpenRequest, checkToken, inventoryController.getProductTypeById);
router.delete('/producttype/:id', validateOpenRequest, checkToken, inventoryController.removeType);



module.exports = router