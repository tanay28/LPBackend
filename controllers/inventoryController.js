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
    }
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