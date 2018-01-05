// app/auth/user.route.js

'use strict';

const express = require('express');
const GoogleAuth = require('google-auth-library');
const constants = require('../constants');
const authService = require('./auth.service');

const router = express.Router();

module.exports = (oAuth) => {
    router.post('/register', async (req, res, next) => {
        try {
            const params = {
                email: req.body.email,
                password: req.body.password,
                passwordConf: req.body.passwordConf,
            };
            const missingParams = Object.keys(params).filter(key => !params[key]);
            if (missingParams.length > 0) {
                const error = new Error(`Missing params: '${missingParams.join('\', \'')}'`);
                error.code = 'missing_params';
                throw error;
            }
            if (!params.email.match(constants.emailRegex)) {
                const error = new Error('Invalid params: Not an email');
                error.code = 'not_email';
                throw error;
            }
            if (params.password !== params.passwordConf) {
                const error = new Error('Invalid params: passwords don\'t match');
                error.code = 'different_pwds';
                throw error;
            }
            res.json(await authService.register(params));
        } catch (err) {
            next(err);
        }
    });

    router.post('/login', oAuth.grant());

    router.post('/google', async (req, res, next) => {
        try {
            const CLIENT_ID = '';
            const token = req.body.idToken;
            const auth = new GoogleAuth();
            const client = new auth.OAuth2(CLIENT_ID, '', '');
            const verif = await new Promise((resolve, reject) => {
                // Or, if multiple clients access the backend:
                // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
                client.verifyIdToken(token, CLIENT_ID, (e, login) => {
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

    return router;
};
