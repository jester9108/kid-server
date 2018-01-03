// app/routes.js

'use strict';

const express = require('express');
const sampleRouter = require('./sample/sample.route');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('It\'s alive!!!');
});

router.use('/sample', sampleRouter);

module.exports = router;
