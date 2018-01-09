// app/transaction/transaction.route.js

'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const transactionService = require('./transaction.service');

const router = express.Router();

router.post('/send', async (req, res, next) => {
    try {
        const apiKey = req.headers['x-access-token'];
        if (!apiKey) throw new Error('No api key provided');
        const apiPayload = await new Promise((resolve, reject) => {
            jwt.verify(apiKey, process.env.JWT_SECRET, (err, decoded) => {
                if (err) return reject(new Error('Failed to authenticate api key'));
                return resolve(decoded);
            });
        });
        const params = {
            recipient: {
                googleIdToken: req.body.googleIdToken,
                facebookUserToken: req.body.facebookUserToken,
            },
            tokenAmt: req.body.tokenAmt,
            description: req.body.description,
        };
        res.json(await transactionService.sendToken(params, apiPayload));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
