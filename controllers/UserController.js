const logger = require('./LoggerController');
const { loggerStatus, OPERATIONS } = require('../config/LoggerObject');
const Users = require('../model/userModel');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {

    registerUser: async (req, res) => {
        const { userFullName, userEmail, userPassword, userPhoneNo, userPhotoIdUrl } = req.body;
        
        if (!userFullName || !userEmail || !userPassword || !userPhoneNo) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'FullName, email, password and phone no is required!', null, OPERATIONS.USERS.CREATE);
            res.status(400).json({ message: 'FullName, email, password and phone no is required!' });
            return;
        }

        if(userPhoneNo.length != 10) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'A phone no should have 10 digits.!!', null, OPERATIONS.USERS.CREATE);
            res.status(400).json({ message: 'A phone no should have 10 digits.!!' });
            return;
        }

        // Validate duplicate email ids 
        try {
            const alreadyExistsUser = await Users.findOne({ where: { email : userEmail } }).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to fetch data from DB', err, OPERATIONS.USERS.CREATE);
            });

            if (alreadyExistsUser) {
                logger.logActivity(loggerStatus.ERROR, req.body, 'User with email already exists!', null, OPERATIONS.USERS.CREATE);
                res.status(409).json({ message: 'User with email already exists!' });
                return;
            }    
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to select', error, OPERATIONS.USERS.CREATE);
        }

         // Validate duplicate phone numbers 
         try {
            const alreadyExistsPhoneno = await Users.findOne({ where: { phoneNo : userPhoneNo } }).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to fetch data from DB', err, OPERATIONS.USERS.CREATE);
            });

            if (alreadyExistsPhoneno) {
                logger.logActivity(loggerStatus.ERROR, req.body, 'User with phone no already exists!', null, OPERATIONS.USERS.CREATE);
                res.status(409).json({ message: 'User with phone no already exists!' });
                return;
            }    
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to select', error, OPERATIONS.USERS.CREATE);
        }   
        

        try {
            const salt = genSaltSync(10);
            const newUser = new Users({ 
                fullName : userFullName, 
                email: userEmail, 
                password :  hashSync(userPassword, salt),
                phoneNo : userPhoneNo,
                photoIdUrl: userPhotoIdUrl,
                access : true,
                role: 2
             });
            const savedUser = await newUser.save().catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Cannot register user at the moment!', err, OPERATIONS.USERS.CREATE);
                res.status(500).json({ error: "Cannot register user at the moment!" });
            });
        
            if (savedUser) {
                logger.logActivity(loggerStatus.INFO, req.body, 'Registration Successful!!', null, OPERATIONS.USERS.CREATE);
                const userDetails = {
                    id : savedUser.id,
                    fullName : savedUser.fullName,
                    email : savedUser.email,
                    phoneNo : savedUser.phoneNo,
                    photoIdUrl : savedUser.photoIdUrl
                }
                res.json({ 
                    message: 'Registration Successful!!',
                    data: userDetails
                });
            }
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to create', error, OPERATIONS.USERS.CREATE);
        }
    },

    getAllUser: async (req, res) => {
        try {
            const allExistingsUser = await Users.findAll({ attributes: ['fullName', 'email', 'phoneNo', 'photoIdUrl'] }).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to fetch all users', err, OPERATIONS.USERS.RETRIEVE);
            });

            if (allExistingsUser.length > 0) {
                logger.logActivity(loggerStatus.INFO, req.body, 'All Users are retrieved!!', null, OPERATIONS.USERS.RETRIEVE);
                res.status(200).json({ 
                    message: 'All Users are retrieved!!',
                    data: allExistingsUser
                });
            }  else {
                logger.logActivity(loggerStatus.INFO, req.body, 'No user found!!', null, OPERATIONS.USERS.CREATE);
                res.status(409).json({ message: 'No user found!!' });
            }  
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to select', error, OPERATIONS.USERS.CREATE);
        }  
    }
}