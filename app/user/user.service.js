// app/user/user.service.js

'use strict';

const logger = require('../utils').logger;
const User = require('./user.model').Model;

class UserService {
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

    async saveAuthToken(token, userId) {
        try {
            return User.updateOne({ _id: userId }, { authToken: token });
        } catch (err) {
            throw err;
        }
    }

    async getUserIDFromBearerToken(bearerToken) {
        try {
            const user = await User.findOne({ authToken: bearerToken });
            return user._id.toString(); // eslint-disable-line no-underscore-dangle
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new UserService();