// app/appdev/appdev.route.js

'use strict';

const express = require('express');
const appdevService = require('./appdev.service');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.json(await appdevService.appdevMethod());
    } catch (err) {
        next(err);
    }
});

module.exports = router;
