const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URI)
        .then(response => {
            console.log('Connected to MongoDB');
        })
        .catch(error => {
            console.error("field to Connect to MongoDB : ", error);
        });
};

module.exports = connectDB;
