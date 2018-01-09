// app/routes.js

'use strict';

const express = require('express');
const transactionRouter = require('./transaction/transaction.route');

const router = express.Router();

module.exports = (oAuth) => {
    router.use('/auth', require('./auth/auth.route')); // eslint-disable-line global-require
    router.use('/dev', require('./dev/dev.route')(oAuth)); // eslint-disable-line global-require
    router.use('/user', require('./user/user.route')(oAuth)); // eslint-disable-line global-require
    router.use('/token', transactionRouter);
    return router;
};
