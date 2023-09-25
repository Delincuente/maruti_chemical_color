const express = require('express');
const router = express.Router();
const CONFIGS = require('../configs/config');
const MD5 = require('md5');
const Inquiries = require('../models/inquiryModel');

function checkLogin(req, res, next) {
    if (req.session && req.session.login_id) {
        next();
    } else {
        res.redirect('/admin');
    }
}

function checkLoginForLogin(req, res, next) {
    if (req.session && req.session.login_id) {
        res.redirect('/dashboard');
    } else {
        next();
    }
}

router.get('/', [checkLoginForLogin], async (req, res) => {
    res.render("backend/layout/admin_index");
});

router.post('/sign-in', [checkLoginForLogin], async (req, res) => {
    let status = 500;
    let message = "Oops! Something went wrong. Try again or contact support";
    let inputs = req.body;

    if (inputs.user_name && inputs.password) {
        if (inputs.user_name == CONFIGS.ADMIN_USERNAME && MD5(inputs.password) == CONFIGS.ADMIN_PASSWORD) {
            req.session.login_id = CONFIGS.ADMIN_ID;
            status = 200;
            message = "Admin logged in...";
        } else {
            message = "Invalid username or password";
        }
    } else {
        message = "Invalid username or password";
    }
    res.status(status).json({message: message});
});

router.get('/sign-out', async (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
});

router.get('/dashboard', [checkLogin], async (req, res) => {
    res.render('backend/inquiry/index');
});

router.post('/paginate/inquiry-list', [checkLogin], async (req, res) => {
    let inputs = req.body;
    let inquiries = [];
    let inquiriesCount = 0;
    await Inquiries.countDocuments({deleted_at: null})
        .then((count) => {
            inquiriesCount = count;
        })
        .catch((error) => {
            console.log('ERROR:', error);
        });
    await Inquiries.find({deleted_at: null})
        .skip(inputs.start)
        .limit(inputs.length)
        .then((response) => {
            inquiries = response;
        })
        .catch((error) => {
            console.log('ERROR : ', error);
        });

    let list = [];
// Format the date and time with "AM" or "PM"
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };

    inquiries.forEach((item, index) => {
        let obj = {
            index: parseInt(inputs.start) + (index + 1),
            company_name: item.company_name,
            product_name: item.product_name,
            email: item.email,
            uuid: item.uuid
        };
        const date = new Date(item.created_at);
        obj['date'] = date.toLocaleString('en-US', options);
        list.push(obj);
    });

    let data = {
        aaData: list,
        iTotalDisplayRecords: inquiriesCount,
        iTotalRecords: inquiriesCount,
        sEcho: inputs.draw
    };
    res.json(data);
});

// router.get('/:uuid/inquiry-details', [checkLogin], async (req, res) => {
router.get('/:uuid/inquiry-details', [checkLogin], async (req, res) => {
    const uuid = req.params.uuid;
    let data = {};
    await Inquiries.findOne({uuid: uuid, deleted_at: null})
        .then((response) => {
            if (response) {

                data = response;
            }
        })
        .catch((error) => {
            console.log('ERROR : ', error);
        });

    if (Object.keys(data).length > 0) {
        res.render('backend/inquiry/inquiry-details', data);
    } else {
        res.redirect('/admin/dashboard');
    }
});

router.get('/:uuid/inquiry-delete', [checkLogin], async (req, res) => {
    const uuid = req.params.uuid;
    let data = {
        uuid
    };
    res.render('backend/inquiry/delete', data);
});

router.post('/:uuid/inquiry-delete', [checkLogin], async (req, res) => {
    const uuid = req.params.uuid;
    let status = 500;
    let message = "Oops! Something went wrong. Try again or contact support";

    const updateData = {
        $set: {
            deleted_at: new Date(),
        }
    };

    await Inquiries.updateOne({uuid: uuid}, updateData)
        .then((response) => {
            if (response) {
                status = 200;
            }
        })
        .catch((error) => {
            console.log('ERROR : ', error);
        });

    res.json({status, message});
});

module.exports = router;