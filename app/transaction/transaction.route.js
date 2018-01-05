// app/transaction/transaction.route.js

'use strict';

const express = require('express');
const transactionService = require('./transaction.service');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.json(await transactionService.transactionMethod());
    } catch (err) {
        next(err);
    }
});

module.exports = router;
