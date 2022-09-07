const logger = require('./LoggerController');
const { loggerStatus, OPERATIONS } = require('../config/LoggerObject');
const Users = require('../model/usermodel');
module.exports = {

    registerUser: async (req, res) => {
        const { fullName, email, password } = req.body;
        
        if (!fullName || !email || !password) {
            logger.logActivity(loggerStatus.INFO, req.body, 'FullName, email and password is required!', null, OPERATIONS.USERS.CREATE);
            res.status(400).json({ message: 'FullName, email and password is required!' });
        }

        try {
            const alreadyExistsUser = await Users.findOne({ where: { email } }).catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to fetch data from DB', err, OPERATIONS.USERS.CREATE);
            });

            if (alreadyExistsUser) {
                logger.logActivity(loggerStatus.INFO, req.body, 'User with email already exists!', null, OPERATIONS.USERS.CREATE);
                res.status(409).json({ message: 'User with email already exists!' });
            }    
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to select', err, OPERATIONS.USERS.CREATE);
        }   
        

        try {
            const newUser = new Users({ fullName, email, password });
            const savedUser = await newUser.save().catch((err) => {
                logger.logActivity(loggerStatus.ERROR, req.body, 'Cannot register user at the moment!', err, OPERATIONS.USERS.CREATE);
                res.status(500).json({ error: "Cannot register user at the moment!" });
            });
        
            if (savedUser) {
                logger.logActivity(loggerStatus.INFO, req.body, 'Registration Successful!!', null, OPERATIONS.USERS.CREATE);
                res.json({ 
                    message: 'Registration Successful',
                    newUser: savedUser
                });
            }
        } catch (error) {
            logger.logActivity(loggerStatus.ERROR, req.body, 'Unable to execute db query to create', err, OPERATIONS.USERS.CREATE);
        }
        

    }
}