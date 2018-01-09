// app/auth/user.route.js

'use strict';

const express = require('express');
const GoogleAuth = require('google-auth-library');
const constants = require('../constants');
const authService = require('./auth.service');

const router = express.Router();

router.post('/google', async (req, res, next) => {
    try {
        const token = req.body.idToken;
        const auth = new GoogleAuth();
        const client = new auth.OAuth2(req.body.clientId, '', '');
        const verif = await new Promise((resolve, reject) => {
            client.verifyIdToken(token, req.body.clientId, (e, login) => {
                if (e) return reject(e);
                const payload = login.getPayload();
                const userId = payload.sub;
                return resolve(userId);
                // If request specified a G Suite domain:
                // var domain = payload['hd'];
            });
        });
        res.json(verif);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
