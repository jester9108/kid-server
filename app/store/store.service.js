// app/dev/dev.service.js

'use strict';

const jwt = require('jsonwebtoken');
const logger = require('../utils').logger;
const Store = require('./store.model').Model;
const authMessage = require('../auth/auth.message');
const constants = require('../constants');

class StoreService {
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
            const store = await Store.findOne({ authToken: bearerToken, status: { $ne: constants.status.deleted } });
            return store;
        } catch (err) {
            throw err;
        }
    }

    async reauthenticate(store, password) {
        try {
            const authenticated = await store.matchPassword(password);
            return authenticated;
        } catch (err) {
            throw err;
        }
    }

    async changeEmail(store, newEmail) {
        try {
            await Store.checkEmail(newEmail);
            const oldEmail = store.email;
            store.email = newEmail;
            await store.save();
            return {
                success: true,
                message: 'Email succesfully changed',
                data: {
                    oldEmail: oldEmail,
                    newEmail: newEmail,
                },
            };
        } catch (err) {
            throw err;
        }
    }

    async changePassword(store, newPassword) {
        try {
            const hash = await Store.hashPassword(newPassword);
            store.password = hash;
            await store.save();
            return {
                success: true,
                message: 'Password successfully changed',
                data: [],
            };
        } catch (err) {
            throw err;
        }
    }

    async deleteStore(store) {
        try {
            store.status = constants.status.deleted;
            store.authToken = null;
            await store.save();
            return {
                success: true,
                message: 'Store successfully deleted',
                data: {
                    email: store.email,
                    status: store.status,
                },
            };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new StoreService();

const userService = require('../user/user.service');
