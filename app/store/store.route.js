// app/dev/dev.route.js

'use strict';

const express = require('express');
const multer = require('multer');
const constants = require('../resources/constants');
const storeService = require('./store.service');
const logger = require('../utils').logger;

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

module.exports = (oAuth) => {
    router.post('/register', upload.single('bizRegCert'), async (req, res, next) => {
        try {
            console.log(req.file);
            const params = {
                email: req.body.email,
                password: req.body.password,
                passwordConf: req.body.passwordConf,
                store: { name: req.body.storeName },
                admin: {
                    name: req.body.adminName,
                    bizRegCert: req.file,
                },
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
    router.use('/:storeId', (req, res, next) => {
        if (typeof req.user.id === 'undefined') {
            next(new Error('Invalid access token'));
        } else {
            logger.debug(`Entry authorized (${req.user.id})`);
            if (req.params.storeId === 'me') {
                req.store = req.user;
            } else {
                /**
                 * TODO: - Admin access
                 * 1. Check user is an admin
                 * 2. If not admin, fail the request
                 * 3. Find store of {storeId}
                 * 4. Set the resulting {store} as {req.store}
                 */
            }
            next();
        }
    });

    router.get('/:storeId', (req, res) => {
        const store = req.store;
        res.json({
            success: true,
            message: 'Store fetched',
            data: store,
        });
    });

    router.post('/:storeId/reauth', async (req, res, next) => {
        try {
            const store = req.store;
            if (!req.body.password) throw new Error('Missing param: \'password\'');
            res.json(await storeService.reauthenticate(store, req.body.password));
        } catch (err) {
            next(err);
        }
    });

    router.post('/:storeId/email', async (req, res, next) => {
        try {
            const store = req.store;
            const newEmail = req.body.newEmail;
            if (!newEmail) throw new Error('Missing param: \'newEmail\'');
            if (store.email === newEmail) throw new Error('Invalid param: new email must be different');
            res.json(await storeService.changeEmail(store, newEmail));
        } catch (err) {
            next(err);
        }
    });

    router.post('/:storeId/password', async (req, res, next) => {
        try {
            const store = req.store;
            const newPassword = req.body.newPassword;
            const newPasswordConf = req.body.newPasswordConf;
            if (!newPassword) throw new Error('Missing param: \'newPassword\'');
            if (!newPasswordConf) throw new Error('Missing param: \'newPasswordConf\'');
            if (newPassword !== newPasswordConf) throw new Error('Invalid params: passwords don\'t match');
            if (await store.matchPassword(newPassword)) throw new Error('Invalid param: new password must be different');
            res.json(await storeService.changePassword(store, newPassword));
        } catch (err) {
            next(err);
        }
    });

    router.post('/:storeId/admin-setting', upload.none(), async (req, res, next) => {
        try {
            const store = req.store;
            const newAdminSettings = JSON.parse(req.body.admin);
            res.json(await storeService.updateAdmin(store, newAdminSettings));
        } catch (err) {
            next(err);
        }
    });

    router.post('/:storeId/store-setting', upload.any(), async (req, res, next) => {
        try {
            const store = req.store;
            const newStoreSettings = JSON.parse(req.body.store);
            const imagesToUpload = req.files;
            res.json(await storeService.updateStore(store, newStoreSettings, imagesToUpload));
        } catch (err) {
            next(err);
        }
    });

    router.delete('/:storeId', async (req, res, next) => {
        try {
            const store = req.store;
            res.json(await storeService.deleteStore(store));
        } catch (err) {
            next(err);
        }
    });

    return router;
};
