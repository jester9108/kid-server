// app/user/user.route.js

'use strict';

const express = require('express');
const userService = require('./user.service');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.json(await userService.userMethod());
    } catch (err) {
        next(err);
    }
});

module.exports = router;
