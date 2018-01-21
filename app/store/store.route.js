// app/dev/dev.route.js

'use strict';

const express = require('express');
const constants = require('../constants');
const storeService = require('./store.service');

const router = express.Router();

module.exports = (oAuth) => {
    router.post('/register', async (req, res, next) => {
        try {
            const params = {
                email: req.body.email,
                password: req.body.password,
                passwordConf: req.body.passwordConf,
                admin: { name: req.body.adminName },
                settings: { name: req.body.storeName },
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
            res.json(await storeService.register(params));
        } catch (err) {
            next(err);
        }
    });
    router.post('/login', async (req, res, next) => {
        if (req.body.username) {
            req.body.username += '_store';
        }
        oAuth.grant()(req, res, next);
    });

    router.use('/', async (req, res, next) => {
        if (req.headers.authorization) {
            const auth = req.headers.authorization.split(' ');
            req.headers.authorization = `${auth[0]} store_${auth[1]}`;
        }
        oAuth.authorise()(req, res, next);
    });

    router.get('/me', (req, res) => {
        res.json(req.user);
    });
    

    router.delete('/', async (req, res, next) => {
        try {
            if (typeof req.user.id === 'undefined') throw new Error('Invalid access token');
            res.json(await storeService.deleteStore(req.user));
        } catch (err) {
            next(err);
        }
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
            res.json(await storeService.integrateApplication(params));
        } catch (err) {
            next(err);
        }
    });

    router.get('/app', async (req, res, next) => {
        try {
            const appId = req.query.appId;
            if (!appId) {
                const error = new Error('Missing params: \'appId\'');
                error.code = 'missing_params';
                throw error;
            }
            const containsApp = (function (apps) {
                let numApps = apps.length;
                while (numApps) {
                    const app = apps[numApps - 1];
                    if (app.id === appId) return true;
                    numApps -= 1;
                }
                return false;
            }(req.user.applications));
            if (!containsApp) throw new Error(`Permission error: accessing App (#${appId}) is not permitted`);
            res.json(await storeService.getUserCountsByAppId(appId));
        } catch (err) {
            next(err);
        }
    });

    return router;
};
