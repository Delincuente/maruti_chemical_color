const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const inquirySchema = new Schema({
    uuid: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    inquiry_message: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    deleted_at: {
        type: Date,
        default: null,
    },
});

module.exports = mongoose.model('Inquiries', inquirySchema);

