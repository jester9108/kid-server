// app/store/store.service.js

'use strict';

const jwt = require('jsonwebtoken');
const logger = require('../utils').logger;
const Store = require('./store.model').Model;
const authMessage = require('../auth/auth.message');
const constants = require('../resources/constants');

class StoreService {
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
            const store = await Store.findOne({ accessToken: bearerToken, status: { $ne: constants.status.deleted } });
            return store;
        } catch (err) {
            throw err;
        }
    }

    async reauthenticate(store, password) {
        try {
            const authenticated = await store.matchPassword(password);
            const message = (authenticated) ? 'Reauthenticated' : 'Invalid password';
            return {
                success: authenticated,
                message: message,
            };
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

    async update(store, newStore, settingType) {
        try {
            switch (settingType) {
                case constants.SettingTypes.admin:
                    store.admin = newStore.admin;
                    break;
                case constants.SettingTypes.store:
                    store.store = newStore.store;
                    break;
                case constants.SettingTypes.menu:
                    break;
                case constants.SettingTypes.product:
                    break;
                case constants.SettingTypes.bankAccount:
                    break;
                case constants.SettingTypes.email:
                    break;
                case constants.SettingTypes.password:
                    break;
                default:
                    break;
            }
            await store.save();
            return {
                success: true,
                message: `Store updated (${settingType})`,
                data: [],
            };
        } catch (err) {
            throw err;
        }
    }

    async updateAdmin(store, newStore) {
        return this.update(store, newStore, constants.SettingTypes.admin);
    }

    async updateStore(store, newStore) {
        return this.update(store, newStore, constants.SettingTypes.store);
    }

    async deleteStore(store) {
        try {
            store.status = constants.status.deleted;
            store.accessToken = null;
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
