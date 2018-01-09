// app/dev/dev.route.js

'use strict';

const express = require('express');
const constants = require('../constants');
const devService = require('./dev.service');

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
            res.json(await devService.register(params));
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
                devId: req.user._id,
                name: req.body.name,
                platform: req.body.platform,
                googleClientId: req.body.googleClientId,
                facebookAppToken: req.body.facebookAppToken,
                tokenIssueConds: req.body.tokenIssueConds,
                dailyMaxIssue: req.body.dailyMaxIssue,
            };
            const missingParams = Object.keys(params).filter(key => !params[key]);
            if (missingParams.length > 0) {
                const error = new Error(`Missing params: '${missingParams.join('\', \'')}'`);
                error.code = 'missing_params';
                throw error;
            }
            if (!Object.values(constants.platform).includes(params.platform)) {
                const error = new Error(`Invalid param: 'platform' must be either '${Object.values(constants.platform).join('\', \'')}'`);
                error.code = 'invalid_platform';
                throw error;
            }
            params.tokenIssueConds.forEach((cond) => {
                if (!Object.values(constants.tokenIssueConds).includes(cond)) {
                    const error = new Error(`Invalid param: 'tokenIssueConds' must be either '${Object.values(constants.tokenIssueConds).join('\', \'')}'`);
                    error.code = 'invalid_token_issue_conditions';
                    throw error;
                }
            });
            res.json(await devService.integrateApplication(params));
        } catch (err) {
            next(err);
        }
    });

    return router;
};
