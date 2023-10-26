require('dotenv').config();
const express = require('express');
const engine = require('ejs-locals');
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const session = require('express-session');
const app = express();

let adminRoutes = require('./routes/admin');
let userRoutes = require('./routes/end-user');
const CONFIGS = require('./configs/config');
const connectDB = require('./configs/dbConnection');
const MailNotification = require('./helpers/EmailNotification');
connectDB();
app.use(cors());

const port = CONFIGS.ENV.PORT || 3000;
const environment = CONFIGS.ENV.NODE_ENV || 'development';
app.set('port', port);
app.set('views', __dirname + '/views');
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));

app.use(async function (req, res, next) {
    let appUrl = CONFIGS.BASE_URL;
    res.locals.APP_NAME = CONFIGS.APP_NAME;
    res.locals.BASE_URL = appUrl;
    res.locals.MEDIA_URL = appUrl + '/backend';
    res.locals.SUPPORT_EMAIL = CONFIGS.SUPPORT_EMAIL;
    next();
});

app.use(function logger(req, res, next) {
    console.log(new Date(), req.method, req.url);
    return next();
});

app.use(userRoutes);
app.use('/admin', adminRoutes);
MailNotification.testMail('test');

let listen = app.listen(port, function () {
    listen.timeout = 120000;
    console.log('App listening on port ' + port);
});

// mongoose.connection.once('open', () => {
//     console.log('Connected to MongoDB');
// });