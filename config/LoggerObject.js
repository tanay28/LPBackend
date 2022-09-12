module.exports = {
    loggerStatus: {
        INFO: 'info',
        ERROR: 'error'
    },
    OPERATIONS: {
        USERS: {
            CREATE: 'create an user',
            MODIFY: 'modify user info',
            REMOVE: 'remove user info',
            RETRIEVE: 'get all users'
        },
        DATABASE: {
            CONNECT: 'db connection',
            INSERT: 'insert info into db',
            SELECT: 'select info from db',
            UPDATE: 'update info in db',
            DELETE: 'delete info in db'
        },
        MONGODB: {
            CONNECT: 'mongodb connection'
        },
        AUTH: {
            LOGIN: 'user login',
            ACTIVATION: 'user activation',
            FORGOT_PASS: 'forgot password',
            OTP_VERIFY: 'otp verification',
            NEW_PASS: 'create new password'
        }
    }

};