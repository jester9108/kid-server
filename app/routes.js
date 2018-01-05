// app/routes.js

'use strict';

const express = require('express');
const userRouter = require('./user/user.route');
const appdevRouter = require('./appdev/appdev.route');
const transactionRouter = require('./transaction/transaction.route');

const router = express.Router();

module.exports = (oAuth) => {
    router.use('/auth', require('./auth/auth.route')(oAuth)); // eslint-disable-line global-require
    router.use('/', oAuth.authorise());
    // router.use('/user', userRouter);
    return router;
};
