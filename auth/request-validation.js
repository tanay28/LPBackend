const logger = require('../config/Logger');
const { loggerStatus, OPERATIONS } = require('../config/LoggerObject');

module.exports = {
    validateOpenRequest: (req, res, next) => {
        if(req.get('origin') != undefined && req.get('content-type') != undefined && req.get('requested-timestamp') != undefined && req.get('conversation-id') != undefined) {
            next();
        } else {
            res.status(400).json({
                msg: 'Missing these header informations.(origin, content-type, requested-timestamp, conversation-id)'
            });
        }
    }
}