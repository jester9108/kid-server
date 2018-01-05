// app/auth/auth.service.js

'use strict';

const message = require('./auth.message');
const userService = require('../user/user.service');

class AuthService {
    async getUser(email, password) {
        try {
            return userService.getUser(email, password);
        } catch (err) {
            throw err;
        }
    }

    async register(userData) {
        try {
            return userService.register(userData);
        } catch (err) {
            if (err.code === 11000) {
                let dupeKey = err.errmsg.split('.$')[1];
                dupeKey = dupeKey.split(' dup key')[0];
                dupeKey = dupeKey.substring(0, dupeKey.lastIndexOf('_'));
                return {
                    success: false,
                    message: message.DUPLICATE_KEY(dupeKey),
                    error: 'duplicate_key',
                };
            }
            throw err;
        }
    }

    async saveAuthToken(token, userId) {
        try {
            return userService.saveAuthToken(token, userId);
        } catch (err) {
            throw err;
        }
    }

    async getUserIDFromBearerToken(bearerToken) {
        try {
            return userService.getUserIDFromBearerToken(bearerToken);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new AuthService();
