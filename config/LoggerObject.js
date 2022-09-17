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
            RETRIEVE: 'get all users',
            RETRIEVE_BY_ID: 'get user by id'
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
            NEW_PASS: 'create new password',
            CHNAGE_PASS: 'change old pass'
        },
        SMS: 'SMS gateway',
        QUALITY: {
            CREATE: 'create a new quality',
            MODIFY: 'modify quality info',
            REMOVE: 'remove quality info',
            RETRIEVE: 'get all quality',
            RETRIEVE_BY_ID: 'get quality by id'
        },
        PRODUCT_TYPE: {
            CREATE: 'create a new product type',
            REMOVE: 'remove a new product type',
            RETRIEVE: 'get product type',
            RETRIEVE_BY_ID: 'get product type by id'
        }
    }

};