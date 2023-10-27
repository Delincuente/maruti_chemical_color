const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const CONFIGS = require('../configs/config');
const Inquiries = require('../models/inquiryModel');
const MailNotification = require('../helpers/EmailNotification');

router.get('/', (req, res) => {
    let data = {
        current_menu: 'home',
    };
    res.render('backend/index', data);
});

router.get('/products', (req, res) => {
    let data = {
        current_menu: 'products',
        product_list: CONFIGS.PRODUCT_LIST.sort((a, b) => a.order - b.order)
    };
    res.render('backend/products/index', data);
});

router.get('/products/:id/product-details', (req, res) => {
    let productId = parseInt(req.params.id);

    if (productId > 0) {
        let productData = CONFIGS.PRODUCT_LIST.find(item => (item.id == productId));
        if (productData) {
            let applicationList = [];
            let description = {};
            let additionalInformation = [];
            let filePath = '';
            let fileName = '';
            let msdsFilePath = '';
            let msdsFileName = '';
            let basicDataList = [];
            let productDetails = CONFIGS.PRODUCT_DETAILS.find(item => (item.product_id == productId));
            if (productDetails) {
                if (productDetails.applications && productDetails.applications.length > 0) {
                    applicationList = [...productDetails.applications];
                }
                if (productDetails.description && Object.keys(productDetails.description).length > 0) {
                    description = {...productDetails.description};
                }
                if (productDetails.additional_information && Object.keys(productDetails.additional_information).length > 0) {
                    additionalInformation = [...productDetails.additional_information];
                }
                if (productDetails.file) {
                    fileName = productDetails.file;
                    filePath = CONFIGS.BASE_URL + '/documents/product_details/' + productDetails.file;
                }
                if (productDetails.product_information && productDetails.product_information.length > 0) {
                    basicDataList = [...productDetails.product_information];
                }
                if (productDetails.msds_file) {
                    msdsFileName = productDetails.msds_file;
                    msdsFilePath = CONFIGS.BASE_URL + '/documents/MSDS_certificate/' + productDetails.msds_file;
                }
            }
            productData['file_name'] = fileName;
            productData['file_path'] = filePath;
            productData['msds_file_name'] = msdsFileName;
            productData['msds_file_path'] = msdsFilePath;
            let data = {
                current_menu: 'products',
                product_data: productData,
                basic_data: basicDataList,
                application_list: applicationList,
                description: description,
                additional_information: additionalInformation
            };
            res.render('backend/products/product_details', data);
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});

router.get('/about-us', (req, res) => {
    let data = {
        current_menu: 'about-us',
    };
    res.render('backend/about_us/index', data);
});

router.get('/contact-us', (req, res) => {
    let inputs = req.query;
    let productName = '';
    if (inputs.product) {
        productName = CONFIGS.PRODUCT_LIST.find(item => (item.id == inputs.product))?.name;
    }
    let data = {
        current_menu: 'contact-us',
        product_name: productName
    };
    res.render('backend/contact_us/index', data);
});

router.post('/contact-us', async (req, res) => {
    let status = 500;
    let message = "Oops! Something went wrong. Try again or contact support";
    let inputs = req.body;
    let error = 0;
    if (!inputs.company_name) {
        error++;
        message = 'Company Name is required';
    } else if (!inputs.email) {
        error++;
        message = 'Email is required';
    }
    // else if (!inputs.phone) {
    //     error++;
    //     message = 'Phone number is required';
    // }
    else if (!inputs.product_name) {
        error++;
        message = 'Product Name is required';
    } else if (!inputs.inquiry_message) {
        error++;
        message = 'Inquiry message is required';
    }

    if (error == 0) {
        let obj = {
            uuid: uuidv4(),
            company_name: inputs.company_name,
            email: inputs.email,
            mobile: inputs.phone || '',
            product_name: inputs.product_name,
            inquiry_message: inputs.inquiry_message,
        };
        await Inquiries.create(obj)
            .then(response => {
                status = 200;
                message = "Inquiry has been sent...";
            })
            .catch(error => {
                console.log("ERROR : ", error);
            });

        MailNotification.userInquiry(obj);
    }
    res.status(status).json({message: message});
});

module.exports = router;
