// app/user/user.route.js

'use strict';

const express = require('express');
const constants = require('../constants');
const userService = require('./user.service');

const router = express.Router();

module.exports = (oAuth) => {
    router.post('/register', async (req, res, next) => {
        try {
            const params = {
                email: req.body.email,
                password: req.body.password,
                passwordConf: req.body.passwordConf,
                identity: req.body.identity,
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
            if (!params.identity.dob.match(/^\d{4}-\d{2}-\d{2}$/)) throw new Error('Invalid param: \'identity.dob\' must be in YYYY-MM-DD format');
            res.json(await userService.register(params));
        } catch (err) {
            next(err);
        }
    });
    router.post('/login', oAuth.grant());

    router.use('/', oAuth.authorise());

    router.get('/me', (req, res) => {
        res.json(req.user);
    });

    router.post('/integrate', async (req, res, next) => {
        try {
            const params = {
                user: req.user,
                loginType: req.body.loginType,
                token: req.body.token,
            };
            const missingParams = Object.keys(params).filter(key => !params[key]);
            if (missingParams.length > 0) {
                const error = new Error(`Missing params: '${missingParams.join('\', \'')}'`);
                error.code = 'missing_params';
                throw error;
            }
            if (!Object.values(constants.loginType).includes(params.loginType)) {
                const error = new Error(`Invalid param: 'loginType' must be either '${Object.values(constants.loginType).join('\', \'')}'`);
                error.code = 'invalid_loginType';
                throw error;
            }
            res.json(await userService.integrateSocialId(params));
        } catch (err) {
            next(err);
        }
    });

    router.get('/tokens', async (req, res, next) => {
        try {
            res.json(await userService.getTokenInfo(req.user));
        } catch (err) {
            next(err);
        }
    });

    return router;
};
