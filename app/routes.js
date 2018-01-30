// app/routes.js

'use strict';

const express = require('express');

const resourcesRouter = require('./resources/resources.route');

const router = express.Router();

module.exports = (oAuth) => {
    router.use('/store', require('./store/store.route')(oAuth)); // eslint-disable-line global-require
    // router.use('/user', require('./user/user.route')(oAuth)); // eslint-disable-line global-require
    router.use('/resources', resourcesRouter);
    return router;
};
