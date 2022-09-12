const logger = require('../config/Logger');
const { loggerStatus, OPERATIONS } = require('../config/LoggerObject');

module.exports = {
    validateOpenRequest: (req, res, next) => {
        
        if(req.get('origin') || req.get('content-type') || req.get('requested-timestamp') || req.get('conversation-id')) {
            next();
        } else {
            res.status(400).json({
                msg: 'Missing these header informations.(origin, content-type, requested-timestamp, conversation-id)'
            });
        }
    }
}