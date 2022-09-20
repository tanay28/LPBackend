const logger = require('./LoggerController');
const { loggerStatus, OPERATIONS } = require('../config/LoggerObject');
const { Quality, ShopDetails, ProductType, WareHouse } = require('../model/inventorymodel');
require('dotenv').config();

module.exports = {
    //---------- Quality Rest Methods --------------//
    addQuality: async (req, res, next) => {
        const { qualityName, profitType, profitValue } = req.body;

        if (!qualityName || !profitType || !profitValue) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Quality name, Profit type, Profit value.!!', null, OPERATIONS.QUALITY.CREATE);
            res.status(400).json({ message: 'Quality name, Profit type, Profit value.!!'});
            return;
        }
        try {
            const newQuality = new Quality({ 
                qualityName: qualityName,
                profitType: profitType,
                profitValue: profitValue,
                isDeleted: false
            });

            const savedQuality = await newQuality.save().catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Cannot create quality at the moment!', err, OPERATIONS.QUALITY.CREATE);
                res.status(500).json({ error: 'Cannot create quality at this moment!' });
            });

            if (savedQuality) {
                logger.logActivity(loggerStatus.INFO, req.body, 'New Product added successfully!!', null, OPERATIONS.USERS.CREATE);
                res.status(200).json({ 
                    message: 'New Product added successfully!!',
                    data: savedQuality
                });
            }

        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to create', error, OPERATIONS.QUALITY.CREATE);
        }
    },
    getAllQuality: async (req, res, next) => {
        try {
            const allExistingsQuality = await Quality.findAll({ where: { isDeleted: false }}).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to fetch all qualities!', err, OPERATIONS.QUALITY.RETRIEVE);
                res.status(400).json({ message: 'Unable to fetch all qualities!' });
                return;
            });

            if (allExistingsQuality.length > 0) {
                logger.logActivity(loggerStatus.INFO, req.body, 'All Qualities are retrieved!!', null, OPERATIONS.QUALITY.RETRIEVE);
                res.status(200).json({ 
                    message: 'All Qualities are retrieved!!',
                    data: allExistingsQuality
                });
            }  else {
                logger.logActivity(loggerStatus.INFO, req.body, 'No Quality found!!', null, OPERATIONS.QUALITY.RETRIEVE);
                res.status(400).json({ message: 'No Quality found!!' });
            }

        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to select', error, OPERATIONS.QUALITY.RETRIEVE);
        }
    },
    modifyQuality: async (req, res, next) => {
        const { qualityName, profitType, profitValue } = req.body;

        if(req.params.id == null) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Quality Id is missing.!!', null, OPERATIONS.QUALITY.MODIFY);
            res.status(400).json({ message: 'Quality Id is missing.!!'});
            return;  
        }

        if (!qualityName || !profitType || !profitValue) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Quality name, Profit type, Profit value.!!', null, OPERATIONS.QUALITY.MODIFY);
            res.status(400).json({ message: 'Quality name, Profit type, Profit value.!!'});
            return;
        }

        try {
            const getQuality = await retrieveQualityById(req.params.id);
            
            if (getQuality != null) {
                const modifiedQuality = {
                    qualityName: qualityName,
                    profitType: profitType,
                    profitValue: profitValue
                };
                await Quality.update(modifiedQuality, { where: { id: req.params.id }}).catch((err) => {
                    logger.logActivity(loggerStatus.ERROR, modifiedQuality, 'Internal server error!!', err, OPERATIONS.QUALITY.MODIFY);
                    res.status(500).json({
                        status:500,
                        data: 'Internal server error..!! Please try after some time.'
                    });
                    return;
                });
                logger.logActivity(loggerStatus.ERROR, modifiedQuality, 'Quality updated!!', null, OPERATIONS.QUALITY.MODIFY);
                res.status(200).json({
                    status: 200,
                    data: modifiedQuality
                });
            } else {
                logger.logActivity(loggerStatus.ERROR, modifiedQuality, 'Quality not found!!', err, OPERATIONS.QUALITY.MODIFY);
                res.status(400).json({
                    data: 'Quality not found.!!'
                });
                return; 
            } 
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, null, 'Something went wrong!!', error, OPERATIONS.QUALITY.MODIFY);
            res.status(500).json({
                msg: 'Something went wrong!! Please try again later.',
                data: null
            });
        }
    },
    removeQuality: async (req, res, next) => {
        if (!req.params.id) {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Id required to remove.!!', null, OPERATIONS.QUALITY.REMOVE);
            res.status(400).json({ message: 'Id required to remove.!!'});
            return;
        }

        try {
            await Quality.update({ isDeleted: true }, { where: { id: req.params.id }}).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.params, 'Internal server error!!', err, OPERATIONS.QUALITY.REMOVE);
                res.status(500).json({
                    status:500,
                    data: 'Internal server error..!! Please try after some time.'
                });
                return;
            });
            logger.logActivity(loggerStatus.ERROR, req.params, 'Quality deleted!!', null, OPERATIONS.QUALITY.REMOVE);
            res.status(200).json({
                status: 200,
                id:req.params.id,
                msg: 'Deleted successfully'
            });
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, null, 'Something went wrong!!', error, OPERATIONS.QUALITY.REMOVE);
            res.status(500).json({
                msg: 'Something went wrong!! Please try again later.',
                data: null
            });
        }

    },
    getQualitybyId: async (req, res, next) => {
        if(req.params.id == null) {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Quality Id is missing.!!', null, OPERATIONS.QUALITY.RETRIEVE_BY_ID);
            res.status(400).json({ message: 'Quality Id is missing.!!'});
            return;  
        }
        try {
            const qualityDetails = await retrieveQualityById(req.params.id);
            if(qualityDetails !== null) {
                res.status(200).json({
                    data: qualityDetails
                });
            } else {
                logger.logActivity(loggerStatus.ERROR, req.params, 'Product not found.!!', null, OPERATIONS.QUALITY.RETRIEVE_BY_ID);
                res.status(400).json({
                    msg: 'Product not found.!!'
                });
            }
        } catch (error) {
            console.error(error);
            logger.logActivity(loggerStatus.ERROR, null, 'Something went wrong.!!', error, OPERATIONS.QUALITY.RETRIEVE_BY_ID);
            res.status(500).json({
                msg: 'Something went wrong.!! Please try after some time.'
            });
        }
    },
    //------------------- END ---------------------//

    //--------- Product Type Rest Methods ---------//
    addProductType: async (req, res, next) => {
        const { productTypeName } = req.body;

        if (!productTypeName) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Product type is required.!!', null, OPERATIONS.QUALITY.CREATE);
            res.status(400).json({ message: 'Product type is required.!!'});
            return;
        }

        try {
            const newProductType = new ProductType({
                typeName: productTypeName,
                isDeleted: false
            });
            const savedType = await newProductType.save().catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Cannot create product type at this moment!', err, OPERATIONS.PRODUCT_TYPE.CREATE);
                res.status(500).json({ error: 'Cannot create product type at this moment!' });
            });

            if (savedType) {
                logger.logActivity(loggerStatus.INFO, req.body, 'Product type creation Successful!!', null, OPERATIONS.PRODUCT_TYPE.CREATE);
                res.json({ 
                    message: 'Product type creation Successful!!',
                    data: savedType
                });
            }
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to create', error, OPERATIONS.PRODUCT_TYPE.CREATE);
        }
    },
    getAllProductType: async (req, res, next) => {
        try {
            const allExistingsTypes = await ProductType.findAll({ where: { isDeleted: false }}).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to fetch all product types!', err, OPERATIONS.PRODUCT_TYPE.RETRIEVE);
                res.status(400).json({ message: 'Unable to fetch all product types!' });
                return;
            });

            if (allExistingsTypes.length > 0) {
                logger.logActivity(loggerStatus.INFO, req.body, 'All Types are retrieved!!', null, OPERATIONS.PRODUCT_TYPE.RETRIEVE);
                res.status(200).json({ 
                    message: 'All Types are retrieved!!',
                    data: allExistingsTypes
                });
            }  else {
                logger.logActivity(loggerStatus.INFO, req.body, 'No product type found!!', null, OPERATIONS.PRODUCT_TYPE.RETRIEVE);
                res.status(400).json({ message: 'No product type found!!' });
            }

        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to select', error, OPERATIONS.PRODUCT_TYPE.RETRIEVE);
        }
    },
    getProductTypeById: async (req, res, next) => {
        if(req.params.id == null) {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Type Id is missing.!!', null, OPERATIONS.PRODUCT_TYPE.RETRIEVE_BY_ID);
            res.status(400).json({ message: 'Type Id is missing.!!'});
            return;  
        }

        try {
            const typeDetails = await retrieveTypeById(req.params.id);
            if(typeDetails !== null) {
                res.status(200).json({
                    data: typeDetails
                });
            } else {
                logger.logActivity(loggerStatus.ERROR, req.params, 'Product type not found.!!', null, OPERATIONS.PRODUCT_TYPE.RETRIEVE_BY_ID);
                res.status(500).json({
                    msg: 'Product type not found.!!'
                });
            }
        } catch (error) {
            console.error(error);
            logger.logActivity(loggerStatus.ERROR, null, 'Something went wrong.!!', error, OPERATIONS.PRODUCT_TYPE.RETRIEVE_BY_ID);
                res.status(500).json({
                    msg: 'Something went wrong.!! Please try after some time.'
                });
        }
    },
    removeType: async (req, res, next) => {
        if (!req.params.id) {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Id required to remove.!!', null, OPERATIONS.PRODUCT_TYPE.REMOVE);
            res.status(400).json({ message: 'Id required to remove.!!'});
            return;
        }
        try {
            await ProductType.update({ isDeleted: true }, { where: { id: req.params.id }}).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.params, 'Internal server error!!', err, OPERATIONS.PRODUCT_TYPE.REMOVE);
                res.status(500).json({
                    status:500,
                    data: 'Internal server error..!! Please try after some time.'
                });
                return;
            });
            logger.logActivity(loggerStatus.ERROR, req.params, 'Quality deleted!!', null, OPERATIONS.PRODUCT_TYPE.REMOVE);
            res.status(200).json({
                status: 200,
                id: req.params.id,
                msg: 'Deleted successfully'
            });
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, null, 'Something went wrong!!', error, OPERATIONS.PRODUCT_TYPE.REMOVE);
            res.status(500).json({
                msg: 'Something went wrong!! Please try again later.',
                data: null
            });
        }
    },
    //------------------- END ---------------------//

    //--------- Ware House Rest Methods ---------//
    addWareHouse: async (req, res, next) => {
        const { whName, whAddress, whCapacity, contactPerson } = req.body;
        
        if (!whName || !whAddress || !whCapacity ||!contactPerson ) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Warehouse name, Warehouse adddress, Warehouse capacity, Contact person.!!', null, OPERATIONS.QUALITY.CREATE);
            res.status(400).json({ message: 'Warehouse name, Warehouse adddress, Warehouse capacity, contact person.!!'});
            return;
        }

        try {
            const newWarehouse = new WareHouse({ 
                whName: whName,
                whAddress: whAddress,
                whCapacity: whCapacity,
                contactPerson: contactPerson,
                isDeleted: false
            });

            const savedWarehouse = await newWarehouse.save().catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Cannot create Warehouse at the moment!', err, OPERATIONS.WAREHOUSE.CREATE);
                res.status(500).json({ error: 'Cannot create Warehouse at this moment!' });
            });

            if (savedWarehouse) {
                logger.logActivity(loggerStatus.INFO, req.body, 'New Warehouse added successfully!!', null, OPERATIONS.WAREHOUSE.CREATE);
                res.status(200).json({ 
                    message: 'New Warehouse added successfully!!',
                    data: savedWarehouse
                });
            }
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to create', error, OPERATIONS.WAREHOUSE.CREATE);
        }
    },
    getAllWareHouse: async (req, res, next) => {
        try {
            const allExistingsWarehouse = await WareHouse.findAll({ where: { isDeleted: false }}).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, mull, 'Unable to fetch all Warehouses!', err, OPERATIONS.WAREHOUSE.RETRIEVE);
                res.status(400).json({ message: 'Unable to fetch all Warehouses!' });
                return;
            });

            if (allExistingsWarehouse.length > 0) {
                logger.logActivity(loggerStatus.INFO, null, 'All Warehouses are retrieved!!', null, OPERATIONS.WAREHOUSE.RETRIEVE);
                res.status(200).json({ 
                    message: 'All Warehouses are retrieved!!',
                    data: allExistingsWarehouse
                });
            }  else {
                logger.logActivity(loggerStatus.INFO, null, 'No Quality found!!', null, OPERATIONS.WAREHOUSE.RETRIEVE);
                res.status(400).json({ message: 'No Warehouse found!!' });
            }

        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to select', error, OPERATIONS.WAREHOUSE.RETRIEVE);
        }
    },
    modifyWarehouse: async (req, res, next) => {
        const { whName, whAddress, whCapacity, contactPerson } = req.body;

        if(req.params.id == null) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Warehouse Id is missing.!!', null, OPERATIONS.WAREHOUSE.MODIFY);
            res.status(400).json({ message: 'Warehouse Id is missing.!!'});
            return;  
        }

        if (!whName || !whAddress || !whCapacity || !contactPerson) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Warehouse name, Warehouse adddress, Warehouse capacity, Contact person.!!', null, OPERATIONS.WAREHOUSE.MODIFY);
            res.status(400).json({ message: 'Warehouse name, Warehouse adddress, Warehouse capacity, Contact person.!!'});
            return;
        }

        try {
            const getWarehouse = await retrieveWarehouseById(req.params.id);
            
            if (getWarehouse != null) {
                const modifiedWarehouse = {
                    whName: whName,
                    whAddress: whAddress,
                    whCapacity: whCapacity,
                    contactPerson: contactPerson
                };
                await WareHouse.update(modifiedWarehouse, { where: { id: req.params.id }}).catch((err) => {
                    logger.logActivity(loggerStatus.ERROR, modifiedWarehouse, 'Internal server error!!', err, OPERATIONS.WAREHOUSE.MODIFY);
                    res.status(500).json({
                        status:500,
                        data: 'Internal server error..!! Please try after some time.'
                    });
                    return;
                });
                logger.logActivity(loggerStatus.ERROR, modifiedWarehouse, 'Warehouse updated!!', null, OPERATIONS.WAREHOUSE.MODIFY);
                res.status(200).json({
                    status: 200,
                    data: modifiedWarehouse
                });
            } else {
                logger.logActivity(loggerStatus.ERROR, modifiedWarehouse, 'Warehouse not found!!', err, OPERATIONS.WAREHOUSE.MODIFY);
                res.status(400).json({
                    data: 'Warehouse not found.!!'
                });
                return; 
            } 
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, null, 'Something went wrong!!', error, OPERATIONS.WAREHOUSE.MODIFY);
            res.status(500).json({
                msg: 'Something went wrong!! Please try again later.',
                data: null
            });
        }
    },
    removeWarehouse: async (req, res, next) => {
        if (!req.params.id) {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Id required to remove.!!', null, OPERATIONS.WAREHOUSE.REMOVE);
            res.status(400).json({ message: 'Id required to remove.!!'});
            return;
        }

        try {
            await WareHouse.update({ isDeleted: true }, { where: { id: req.params.id }}).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.params, 'Internal server error!!', err, OPERATIONS.WAREHOUSE.REMOVE);
                res.status(500).json({
                    status:500,
                    data: 'Internal server error..!! Please try after some time.'
                });
                return;
            });
            logger.logActivity(loggerStatus.ERROR, req.params, 'Warehouse deleted!!', null, OPERATIONS.WAREHOUSE.REMOVE);
            res.status(200).json({
                status: 200,
                id:req.params.id,
                msg: 'Deleted successfully'
            });
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, null, 'Something went wrong!!', error, OPERATIONS.WAREHOUSE.REMOVE);
            res.status(500).json({
                msg: 'Something went wrong!! Please try again later.',
                data: null
            });
        }

    },
    getWarehousebyId: async (req, res, next) => {
        if(req.params.id == null) {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Warehouse Id is missing.!!', null, OPERATIONS.WAREHOUSE.RETRIEVE_BY_ID);
            res.status(400).json({ message: 'Warehouse Id is missing.!!'});
            return;  
        }
        try {
            const warehouseDetails = await retrieveWarehouseById(req.params.id);
            if(warehouseDetails !== null) {
                res.status(200).json({
                    data: warehouseDetails
                });
            } else {
                logger.logActivity(loggerStatus.ERROR, req.params, 'Warehouse not found.!!', null, OPERATIONS.WAREHOUSE.RETRIEVE_BY_ID);
                res.status(400).json({
                    msg: 'Warehouse not found.!!'
                });
            }
        } catch (error) {
            console.error(error);
            logger.logActivity(loggerStatus.ERROR, null, 'Something went wrong.!!', error, OPERATIONS.WAREHOUSE.RETRIEVE_BY_ID);
            res.status(500).json({
                msg: 'Something went wrong.!! Please try after some time.'
            });
        }
    },
    //------------------- END ---------------------//

    //--------- Shop Details Rest Methods ---------//
    addShopDetails: async (req, res, next) => {
        const { shName, shAddress, shCapacity, contactPerson } = req.body;
        
        if (!shName || !shAddress || !shCapacity ||!contactPerson ) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Shop name, Shop adddress, Shop capacity, Contact person.!!', null, OPERATIONS.SHOPDETAILS.CREATE);
            res.status(400).json({ message: 'Shop name, Shop adddress, Shop capacity, Contact person.!!'});
            return;
        }

        try {
            const newShop = new ShopDetails({ 
                shName: shName,
                shAddress: shAddress,
                shCapacity: shCapacity,
                contactPerson: contactPerson,
                isDeleted: false
            });

            const savedShops = await newShop.save().catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Cannot create Shop at the moment!', err, OPERATIONS.SHOPDETAILS.CREATE);
                res.status(500).json({ error: 'Cannot create Shop at this moment!' });
            });

            if (savedShops) {
                logger.logActivity(loggerStatus.INFO, req.body, 'New Shop added successfully!!', null, OPERATIONS.SHOPDETAILS.CREATE);
                res.status(200).json({ 
                    message: 'New Shop added successfully!!',
                    data: savedShops
                });
            }
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, null, 'Unable to execute db query to create', error, OPERATIONS.SHOPDETAILS.CREATE);
        }
    },
    getAllShopDetails: async (req, res, next) => {
        try {
            const allExistingsShop = await ShopDetails.findAll({ where: { isDeleted: false }}).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, mull, 'Unable to fetch all Shops!', err, OPERATIONS.SHOPDETAILS.RETRIEVE);
                res.status(400).json({ message: 'Unable to fetch all Shops!' });
                return;
            });

            if (allExistingsShop.length > 0) {
                logger.logActivity(loggerStatus.INFO, null, 'All Shops are retrieved!!', null, OPERATIONS.SHOPDETAILS.RETRIEVE);
                res.status(200).json({ 
                    message: 'All Shops are retrieved!!',
                    data: allExistingsShop
                });
            }  else {
                logger.logActivity(loggerStatus.INFO, null, 'No Shop found!!', null, OPERATIONS.SHOPDETAILS.RETRIEVE);
                res.status(400).json({ message: 'No Shop found!!' });
            }

        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to select', error, OPERATIONS.SHOPDETAILS.RETRIEVE);
        }
    },
    modifyShopDetails: async (req, res, next) => {
        const { shName, shAddress, shCapacity, contactPerson } = req.body;

        if(req.params.id == null) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Shop Id is missing.!!', null, OPERATIONS.SHOPDETAILS.MODIFY);
            res.status(400).json({ message: 'Shop Id is missing.!!'});
            return;  
        }

        if (!shName || !shAddress || !shCapacity ||!contactPerson) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Shop name, Shop adddress, Shop capacity, Contact person.!!', null, OPERATIONS.SHOPDETAILS.MODIFY);
            res.status(400).json({ message: 'Warehouse name, Warehouse adddress, Warehouse capacity, Contact person.!!'});
            return;
        }

        try {
            const getShop = await retrieveShopById(req.params.id);
            
            if (getShop != null) {
                const modifiedShop = {
                    shName: shName,
                    shAddress: shAddress,
                    shCapacity: shCapacity,
                    contactPerson: contactPerson
                };
                await ShopDetails.update(modifiedShop, { where: { id: req.params.id }}).catch((err) => {
                    logger.logActivity(loggerStatus.ERROR, modifiedShop, 'Internal server error!!', err, OPERATIONS.SHOPDETAILS.MODIFY);
                    res.status(500).json({
                        status:500,
                        msg: 'Internal server error..!! Please try after some time.'
                    });
                    return;
                });
                logger.logActivity(loggerStatus.ERROR, modifiedShop, 'Shop updated!!', null, OPERATIONS.SHOPDETAILS.MODIFY);
                res.status(200).json({
                    status: 200,
                    data: modifiedShop
                });
            } else {
                logger.logActivity(loggerStatus.ERROR, modifiedShop, 'Shop not found!!', err, OPERATIONS.SHOPDETAILS.MODIFY);
                res.status(400).json({
                    data: 'Shop not found.!!'
                });
                return; 
            } 
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, null, 'Something went wrong!!', error, OPERATIONS.SHOPDETAILS.MODIFY);
            console.log(error);
            res.status(500).json({
                msg: 'Something went wrong!! Please try again later.',
                data: null
            });
        }
    },
    removeShopDetails: async (req, res, next) => {
        if (!req.params.id) {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Id required to remove.!!', null, OPERATIONS.SHOPDETAILS.REMOVE);
            res.status(400).json({ message: 'Id required to remove.!!'});
            return;
        }

        try {
            await ShopDetails.update({ isDeleted: true }, { where: { id: req.params.id }}).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.params, 'Internal server error!!', err, OPERATIONS.SHOPDETAILS.REMOVE);
                res.status(500).json({
                    status:500,
                    data: 'Internal server error..!! Please try after some time.'
                });
                return;
            });
            logger.logActivity(loggerStatus.ERROR, req.params, 'Shop deleted!!', null, OPERATIONS.SHOPDETAILS.REMOVE);
            res.status(200).json({
                status: 200,
                id:req.params.id,
                msg: 'Deleted successfully'
            });
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, null, 'Something went wrong!!', error, OPERATIONS.SHOPDETAILS.REMOVE);
            res.status(500).json({
                msg: 'Something went wrong!! Please try again later.',
                data: null
            });
        }

    },
    getShopDetailsbyId: async (req, res, next) => {
        if(req.params.id == null) {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Shop Id is missing.!!', null, OPERATIONS.SHOPDETAILS.RETRIEVE_BY_ID);
            res.status(400).json({ message: 'Shop Id is missing.!!'});
            return;  
        }
        try {
            const shopDetails = await retrieveShopById(req.params.id);
            if(shopDetails !== null) {
                res.status(200).json({
                    data: shopDetails
                });
            } else {
                logger.logActivity(loggerStatus.ERROR, req.params, 'Shop not found.!!', null, OPERATIONS.SHOPDETAILS.RETRIEVE_BY_ID);
                res.status(400).json({
                    msg: 'Shop not found.!!'
                });
            }
        } catch (error) {
            console.error(error);
            logger.logActivity(loggerStatus.ERROR, null, 'Something went wrong.!!', error, OPERATIONS.SHOPDETAILS.RETRIEVE_BY_ID);
            res.status(500).json({
                msg: 'Something went wrong.!! Please try after some time.'
            });
        }
    },
    //------------------- END ---------------------//

}

retrieveQualityById = async (id) => {
    
    try {
        const qualityDetails = await Quality.findOne({ where: { id : id, isDeleted : false } }).catch((err) => {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Unable to fetch data from DB', err, OPERATIONS.QUALITY.RETRIEVE_BY_ID);
            res.status(400).json({ error: 'Quality not found.!!' });
            return;
        });
        return qualityDetails;
    } catch (error) {
        logger.logActivity(loggerStatus.ERROR, null, 'Unable to execute db query to create', error, OPERATIONS.QUALITY.RETRIEVE_BY_ID);
    }
}
retrieveTypeById = async (id) => {
    try {
        const typeDetails = await ProductType.findOne({ where: { id : id, isDeleted : false } }).catch((err) => {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Unable to fetch data from DB', err, OPERATIONS.PRODUCT_TYPE.RETRIEVE_BY_ID);
            res.status(400).json({ error: 'Product type not found.!!' });
            return;
        });
        return typeDetails;
    } catch (error) {
        logger.logActivity(loggerStatus.ERROR, null, 'Unable to execute db query to create', error, OPERATIONS.PRODUCT_TYPE.RETRIEVE_BY_ID);
    }
}
retrieveWarehouseById = async (id) => {
    try {
        const wareHouseDetails = await WareHouse.findOne({ where: { id : id, isDeleted : false } }).catch((err) => {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Unable to fetch data from DB', err, OPERATIONS.WAREHOUSE.RETRIEVE_BY_ID);
            res.status(400).json({ error: 'Warehouse type not found.!!' });
            return;
        });
        return wareHouseDetails;
    } catch (error) {
        logger.logActivity(loggerStatus.ERROR, null, 'Unable to execute db query to create', error, OPERATIONS.WAREHOUSE.RETRIEVE_BY_ID);
    }
}
retrieveShopById = async (id) => {
    try {
        const shopDetails = await ShopDetails.findOne({ where: { id : id, isDeleted : false } }).catch((err) => {
            logger.logActivity(loggerStatus.ERROR, req.params, 'Unable to fetch data from DB', err, OPERATIONS.SHOPDETAILS.RETRIEVE_BY_ID);
            res.status(400).json({ error: 'Shop not found.!!' });
            return;
        });
        return shopDetails;
    } catch (error) {
        logger.logActivity(loggerStatus.ERROR, null, 'Unable to execute db query to create', error, OPERATIONS.SHOPDETAILS.RETRIEVE_BY_ID);
    }
}