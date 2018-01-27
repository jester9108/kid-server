// app/user/user.service.js

'use strict';

const logger = require('../utils').logger;
const constants = require('../constants');
const authService = require('../auth/auth.service');
const authMessage = require('../auth/auth.message');
const User = require('./user.model').Model;

class UserService {
    async getUserFromSocialId(userData, apiPayload) {
        const googleToken = userData.googleIdToken;
        const facebookToken = userData.facebookUserToken;
        try {
            const userQuery = { $or: [] };
            if (googleToken) {
                const googleId = await authService.googleAuth(googleToken, apiPayload.googleClientId);
                userQuery.$or.push({ 'socialIds.google': googleId });
            }
            if (facebookToken) {
                const facebookId = await authService.facebookAuth(facebookToken, apiPayload.facebookAppToken);
                userQuery.$or.push({ 'socialIds.facebook': facebookId });
            }
            const user = await User.findOne(userQuery);
            return user;
        } catch (err) {
            throw err;
        }
    }

    async register(userData) {
        try {
            logger.debug('Creating new user...');
            const user = new User(userData);
            await user.save();
            return {
                success: true,
                message: `New user (${user.email}) created`,
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

    async getUser(email, password) {
        try {
            const user = await User.authenticate(email, password);
            return user;
        } catch (err) {
            throw err;
        }
    }

    async getUserFromBearerToken(bearerToken) {
        try {
            const user = await User.findOne({ accessToken: bearerToken });
            return user;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new UserService();