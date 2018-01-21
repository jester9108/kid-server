// app/routes.js

'use strict';

const express = require('express');
// const transactionRouter = require('./transaction/transaction.route');

const router = express.Router();

module.exports = (oAuth) => {
    router.use('/store', require('./store/store.route')(oAuth)); // eslint-disable-line global-require
    // router.use('/user', require('./user/user.route')(oAuth)); // eslint-disable-line global-require
    // router.use('/token', transactionRouter);
    return router;
};
