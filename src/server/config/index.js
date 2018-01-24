const path = require('path');
module.exports = {
    ROOT_URL: (process.env.NODE_ENV == 'dev') ? `localhost:${this.PORT}` : 'https://meme-picker.herokuapp.com',
    DB_URL: (process.env.NODE_ENV == 'dev') ?
        `mongodb://${process.env.DB_LOGIN_DEV}:${process.env.DB_PSW_DEV}@ds261527.mlab.com:61527/int20test_dev` :
        `mongodb://${process.env.DB_LOGIN_PROD}:${process.env.DB_PSW_PROD}@ds046677.mlab.com:46677/int20test`,
    PORT: process.env.PORT || 3000,
    security: {
        TOKEN_LIFE: {
            access: 60 * 60, //1 hour
            refresh: 60 * 60 * 24 * 10, //20 days,
            activation:60*60*3, //3 hours
        },
        SERVER_SALT:process.env.SERVER_SALT,
    },
    PAGINATION_LIMIT: Number(process.env.PAGINATION_LIMIT) || 25,
    VIEW_URL:(process.env.NODE_ENV == 'dev') ? `localhost:8080` : 'https://meme-picker.herokuapp.com',
};