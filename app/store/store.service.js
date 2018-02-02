// app/store/store.service.js

'use strict';

const jwt = require('jsonwebtoken');
const aws = require('../aws/aws.service');
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
            const store = await Store.findOne({ accessToken: bearerToken, status: { $ne: constants.Status.deleted } });
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

    async updateAdmin(store, newAdminSettings) {
        try {
            store.admin.name = newAdminSettings.name;
            store.admin.phone = newAdminSettings.phone;
            return this.update(store);
        } catch (err) {
            throw err;
        }
    }

    async updateStore(store, newStoreSettings, imagesToUpload) {
        try {
            store.store.name = newStoreSettings.name;
            store.store.address = newStoreSettings.address;
            store.store.description = newStoreSettings.description;
            store.store.phone = newStoreSettings.phone;
            store.store.website = newStoreSettings.website;
            store.store.tag = newStoreSettings.tag;
            store.store.age = newStoreSettings.age;
            store.store.maxCapacity = newStoreSettings.maxCapacity;
            store.store.openHour = newStoreSettings.openHour;
            store.store.amenities = newStoreSettings.amenities;

            const uploadingImageIndices = [];
            store.store.images = newStoreSettings.images.map((newImage) => {
                if (newImage._id) {
                    let imageIndex;
                    store.store.images.forEach((savedImage, index) => {
                        if (savedImage.id === newImage._id) {
                            savedImage.desc = newImage.desc;
                            imageIndex = index;
                        }
                    });
                    if (typeof imageIndex === 'undefined') {
                        return null;
                    }
                    return store.store.images[imageIndex];
                } else if (typeof newImage.fileIndex !== 'undefined') {
                    const match = imagesToUpload.filter(file => file.fieldname === `file_${newImage.fileIndex}`);
                    if (match.length === 0) return null;
                    newImage.file = match[0];
                    return newImage;
                }
                return null;
            }).filter(image => image !== null);

            const uploadRequests = [];
            store.store.images.forEach((image, index) => {
                if (image.file) {
                    uploadRequests.push(new Promise((resolve, reject) => {
                        aws.uploadToBucket('kid-businesses', store, 'images', image.file, image.id)
                            .then((uploadResult) => {
                                store.store.images[index].url = uploadResult.Location;
                                store.store.images[index].file = null;
                                resolve();
                            })
                            .catch(error => reject(error));
                    }));
                }
            });
            await Promise.all(uploadRequests);
            return this.update(store);
        } catch (err) {
            throw err;
        }
    }

    async deleteStore(store) {
        try {
            store.status = constants.Status.deleted;
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
