require('dotenv').config();
let productList = require('./product_list.json')['product_list'];
let productDetails = require('./product_details.json')['product_details'];
module.exports = {
    APP_NAME: process.env.APP_NAME,
    ENV: process.env,
    BASE_URL: process.env.APP_URL,
    SUPPORT_EMAIL: "info@marutichemex.com",
    PRODUCT_LIST: productList,
    PRODUCT_DETAILS: productDetails,
    ADMIN_USERNAME: 'admin@admin.com',
    ADMIN_PASSWORD: '0e7517141fb53f21ee439b355b5a1d0a',
    ADMIN_ID: process.env.ADMIN_ID
};
