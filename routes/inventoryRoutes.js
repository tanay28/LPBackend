const router = require('express').Router();
const inventoryController = require('../controllers/inventoryController');
const { validateOpenRequest } = require('../auth/request-validation');
const { checkToken } = require('../auth/Token_validation');
const { authoriseAdminRoutes } = require('../auth/authorise_admin_routes');  

router.post('/quality', validateOpenRequest, checkToken, inventoryController.addQuality);
router.get('/quality', validateOpenRequest, checkToken, inventoryController.getAllQuality);
router.get('/quality/:id', validateOpenRequest, checkToken, inventoryController.getQualitybyId);
router.put('/quality/:id', validateOpenRequest, checkToken, inventoryController.modifyQuality);
router.delete('/quality/:id', validateOpenRequest, checkToken, inventoryController.removeQuality);

router.post('/producttype', validateOpenRequest, checkToken, inventoryController.addProductType);
router.get('/producttype', validateOpenRequest, checkToken, inventoryController.getAllProductType);
router.get('/producttype/:id', validateOpenRequest, checkToken, inventoryController.getProductTypeById);
router.delete('/producttype/:id', validateOpenRequest, checkToken, inventoryController.removeType);


//------------- These Routes requires Admin rights in order to access it ------------------------//
router.post('/shop', validateOpenRequest, authoriseAdminRoutes, inventoryController.addShopDetails);
router.get('/shop', validateOpenRequest, authoriseAdminRoutes, inventoryController.getAllShopDetails);
router.get('/shop/:id', validateOpenRequest, authoriseAdminRoutes, inventoryController.getShopDetailsbyId);
router.put('/shop/:id', validateOpenRequest, authoriseAdminRoutes, inventoryController.modifyShopDetails);
router.delete('/shop/:id', validateOpenRequest, authoriseAdminRoutes, inventoryController.removeShopDetails);

router.post('/warehouse', validateOpenRequest, authoriseAdminRoutes, inventoryController.addWareHouse);
router.get('/warehouse', validateOpenRequest, authoriseAdminRoutes, inventoryController.getAllWareHouse);
router.get('/warehouse/:id', validateOpenRequest, authoriseAdminRoutes, inventoryController.getWarehousebyId);
router.put('/warehouse/:id', validateOpenRequest, authoriseAdminRoutes, inventoryController.modifyWarehouse);
router.delete('/warehouse/:id', validateOpenRequest, authoriseAdminRoutes, inventoryController.removeWarehouse);
//------------------------------------- END --------------------------------------------------------//


module.exports = router