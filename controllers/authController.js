const logger = require('./LoggerController');
const { loggerStatus, OPERATIONS } = require('../config/LoggerObject');
const Users = require('../model/usermodel');
const { compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
require('dotenv').config();

const processLogin = (userCredential, password, username) => {
    try {
        const result = compareSync(password, userCredential.password);
        if (result) {
            userCredential.password = undefined;
            const jsontoken = sign({ result: userCredential }, process.env.SALT, {
                expiresIn: "3h"
            });
            logger.logActivity(loggerStatus.ERROR, username, 'login successfully', null, OPERATIONS.AUTH.LOGIN);
            return jsontoken;
        } else {
            return null;
        }
    } catch (error) {
        logger.logActivity(loggerStatus.ERROR, username, 'Unable to process login!', error, OPERATIONS.AUTH.LOGIN);
    }
}

module.exports = {

    login : async (req, res, next) => {
        const { username, password } = req.body;
        
        if (!username || !password) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Username and Password required.!!', null, OPERATIONS.AUTH.LOGIN);
            res.status(400).json({ message: 'Username and Password required.!!' });
            return;
        }
        
        let userCredential;
        if (username.includes('@')) {
            // Find credential with user email as username
            userCredential = await Users.findOne({ where: { email : username } }).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to fetch data from DB', err, OPERATIONS.AUTH.LOGIN);
            });
        } else {
            // Find credential with user phone no as username
            userCredential = await Users.findOne({ where: { phoneNo : username } }).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to fetch data from DB', err, OPERATIONS.AUTH.LOGIN);
            });
        }

        if (userCredential && userCredential != null) {
            if (userCredential.access) {
                const jsontoken = processLogin(userCredential, password, username)
                if (jsontoken != null) {
                    res.status(200).json({
                        status: 200,
                        message: "login successfully",
                        token: jsontoken
                    });
                    return;
                } else {
                    logger.logActivity(loggerStatus.ERROR, username, 'Invalid password!!', null, OPERATIONS.AUTH.LOGIN);
                    res.status(400).json({
                        status:400,
                        data: "Invalid password!!"
                    });
                    return;
                }
            } else {
                logger.logActivity(loggerStatus.ERROR, username, 'Account is inavtive', null, OPERATIONS.AUTH.LOGIN);
                res.status(400).json({
                    status:400,
                    data: "This account is not yet activated.!! Please contact your system adminstrator."
                });
                return;
            }
           
        } else {
            logger.logActivity(loggerStatus.ERROR, username, 'Invalid username!!', null, OPERATIONS.AUTH.LOGIN);
            res.status(400).json({
                status:400,
                data: "Invalid username!!"
            });
            return;
        }
    }
}