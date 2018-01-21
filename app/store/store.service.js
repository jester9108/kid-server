// app/dev/dev.service.js

'use strict';

const jwt = require('jsonwebtoken');
const logger = require('../utils').logger;
const Store = require('./store.model').Model;
const authMessage = require('../auth/auth.message');

class DevService {
    /* async getUserCountsByAppId(appId) {
        try {
            const appUsers = await userService.getUsersByAppId(appId); // eslint-disable-line no-use-before-define
            return {
                success: true,
                message: `App (#${appId} user counts fetched`,
                data: {
                    userCount: appUsers.length,
                },
            };
        } catch (err) {
            throw err;
        }
    } */

    /* async issueToken(transaction) {
        try {
            const dev = await Store.findOne({ _id: transaction.devId });
            // TODO: Check if app daily maximum is not reached
            let numApps = dev.applications.length;
            while (numApps) {
                const app = dev.applications[numApps - 1];
                if (app.id === transaction.appId) {
                    app.totalTokensIssued += transaction.tokenAmt;
                    break;
                }
                numApps -= 1;
            }
            await dev.save();
        } catch (err) {
            throw err;
        }
    } */

    /* async integrateApplication(params) {
        try {
            const dev = await Store.findOne({ _id: params.devId });
            const numApps = dev.applications.length;
            dev.applications.push({
                name: params.name,
                platform: params.platform,
                googleClientId: params.googleClientId,
                facebookAppToken: params.facebookAppToken,
                tokenIssueConds: params.tokenIssueConds,
                dailyMaxIssue: params.dailyMaxIssue,
            });
            const apiKey = await new Promise((resolve, reject) => {
                jwt.sign(
                    {
                        devId: params.devId,
                        appId: dev.applications[numApps].id,
                        googleClientId: params.googleClientId,
                        facebookAppToken: params.facebookAppToken,
                    },
                    process.env.JWT_SECRET,
                    (err, token) => {
                        if (err) return reject(err);
                        return resolve(token);
                    }
                );
            });
            dev.applications[numApps].apiKey = apiKey;
            await dev.save();
            return {
                success: true,
                message: `API key created for app '${params.name}'`,
                data: { apiKey: apiKey },
            };
        } catch (err) {
            throw err;
        }
    } */

    async register(storeData) {
        try {
            logger.debug('Creating new store...');
            const store = new Store(storeData);
            await store.save();
            return {
                success: true,
                message: `New store (${store.email}) created`,
                data: [],
            };
        } catch (err) {
            if (err.code === 11000) {
                let dupeKey = err.errmsg.split('.$')[1];
                dupeKey = dupeKey.split(' dup key')[0];
                dupeKey = dupeKey.substring(0, dupeKey.lastIndexOf('_'));
                return {
                    success: false,
                    message: authMessage.DUPLICATE_KEY(dupeKey),
                    error: 'duplicate_key',
                };
            }
            throw err;
        }
    }

    async getStore(email, password) {
        try {
            const store = await Store.authenticate(email, password);
            return store;
        } catch (err) {
            throw err;
        }
    }

    async getStoreFromBearerToken(bearerToken) {
        try {
            const store = await Store.findOne({ authToken: bearerToken });
            return store;
        } catch (err) {
            throw err;
        }
    }

    async deleteStore(store) {
        try {
            const deleteResult = await store.remove();
            return deleteResult;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new DevService();

const userService = require('../user/user.service');
