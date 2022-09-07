
const { version } = require('../package.json');
const logger = require('../config/Logger');
const healthCheck = (req, res) =>{

    const healthcheckData = {
        Message: `Backend Service is up and running From ${req.app.get('env')}`,
        port: req.app.get('port'),
        applicationVersion: version, 
        uptime: process.uptime(),
        responseTime: process.hrtime(),
        status: 'OK',
        timestamp: Date.now()
    };
    logger.error(JSON.stringify(healthcheckData));
    res.status(200).send(healthcheckData);
}
module.exports = {
    healthCheck
}
