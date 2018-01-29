// app/dev/dev.route.js

'use strict';

const express = require('express');
const constants = require('../constants');
const storeService = require('./store.service');
const logger = require('../utils').logger;

const router = express.Router();

module.exports = (oAuth) => {
    router.post('/register', async (req, res, next) => {
        try {
            const params = {
                email: req.body.email,
                password: req.body.password,
                passwordConf: req.body.passwordConf,
                settings: { name: req.body.storeName },
                admin: { name: req.body.adminName },
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
    router.post('/login', (req, res, next) => {
        if (req.body.username) {
            req.body.username += '_store';
        }
        oAuth.grant()(req, res, next);
    });

    /** 
     * Everything below: Use OAuth token to access store data
     */
    router.use('/', (req, res, next) => {
        if (req.headers.authorization) {
            const auth = req.headers.authorization.split(' ');
            req.headers.authorization = `${auth[0]} store_${auth[1]}`;
        }
        oAuth.authorise()(req, res, next);
    });
    router.use('/', (req, res, next) => {
        if (typeof req.user.id === 'undefined') {
            next(new Error('Invalid access token'));
        } else {
            logger.debug(`Entry authorized (${req.user.id})`);
            next();
        }
    });

    // Change email & password
    router.post('/reauth', async (req, res, next) => {
        try {
            if (!req.body.password) throw new Error('Missing param: \'password\'');
            res.json({ success: await storeService.reauthenticate(req.user, req.body.password) });
        } catch (err) {
            next(err);
        }
    });
    router.post('/change-email', async (req, res, next) => {
        try {
            if (typeof req.user.id === 'undefined') throw new Error('Invalid access token');
            const newEmail = req.body.newEmail;
            if (!newEmail) throw new Error('Missing param: \'newEmail\'');
            if (req.user.email === newEmail) throw new Error('Invalid param: new email must be different');
            res.json(await storeService.changeEmail(req.user, newEmail));
        } catch (err) {
            next(err);
        }
    });

    router.post('/change-password', async (req, res, next) => {
        try {
            if (typeof req.user.id === 'undefined') throw new Error('Invalid access token');
            const newPassword = req.body.newPassword;
            const newPasswordConf = req.body.newPasswordConf;
            if (!newPassword) throw new Error('Missing param: \'newPassword\'');
            if (!newPasswordConf) throw new Error('Missing param: \'newPasswordConf\'');
            if (newPassword !== newPasswordConf) throw new Error('Invalid params: passwords don\'t match');
            if (await req.user.matchPassword(newPassword)) throw new Error('Invalid param: new password must be different');
            res.json(await storeService.changePassword(req.user, newPassword));
        } catch (err) {
            next(err);
        }
    });

    router.get('/:storeId', (req, res) => {
        let store;
        if (req.params.storeId === 'me') {
            store = req.user;
        }
        res.json({
            success: true,
            message: 'Store fetched',
            data: store,
        });
    });

    router.post('/:storeId/admin', async (req, res, next) => {
        try {
            let store;
            if (req.params.storeId === 'me') {
                store = req.user;
            }
            const admin = req.body.admin;
            res.json(await storeService.updateAdmin(store, admin));
        } catch (err) {
            next(err);
        }
    });

    router.delete('/:storeId', async (req, res, next) => {
        try {
            let store;
            if (req.params.storeId === 'me') {
                store = req.user;
            }
            res.json(await storeService.deleteStore(store));
        } catch (err) {
            next(err);
        }
    });

    return router;
};
