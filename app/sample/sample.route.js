// app/sample/sample.route.js

'use strict';

const express = require('express');
const sampleService = require('./sample.service');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.json(await sampleService.sampleMethod());
    } catch (err) {
        next(err);
    }
});

module.exports = router;
