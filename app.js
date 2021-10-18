require('dotenv').config()

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const callsRouter = require('./routes/calls');
const deleteRoomRouter = require('./routes/deleteRoom')

var admin = require("firebase-admin");

var serviceAccount = process.env.SERVICE_ACCOUNT_KEY
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount))
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/call', callsRouter);
app.use('/deleteRoom', deleteRoomRouter);

app.listen(process.env.PORT || 3000, '0.0.0.0');

module.exports = app;
