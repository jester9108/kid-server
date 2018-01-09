// app/auth/auth.service.js

'use strict';

const request = require('request-promise');
const GoogleAuth = require('google-auth-library');

class AuthService {
    async getUser(email, password) {
        let devFlag;
        try {
            if (typeof password === 'undefined') {
                // Find by bearer token
                let bearerToken = email;
                devFlag = bearerToken.substring(0, 4) === 'dev_';
                if (devFlag) {
                    bearerToken = bearerToken.substring(4);
                    return devService.getDeveloperFromBearerToken(bearerToken);
                }
                return userService.getUserFromBearerToken(bearerToken);
            }
            // Find by email & password
            devFlag = email.slice(-4) === '_dev';
            if (devFlag) {
                email = email.slice(0, -4);
                return devService.getDeveloper(email, password);
            }
            return userService.getUser(email, password);
        } catch (err) {
            throw err;
        }
    }

    async saveAuthToken(token, user) {
        try {
            user.authToken = token;
            return user.save();
        } catch (err) {
            throw err;
        }
    }

    async googleAuth(token, clientId) {
        try {
            const auth = new GoogleAuth();
            const client = new auth.OAuth2(clientId, '', '');
            const verif = await new Promise((resolve, reject) => {
                client.verifyIdToken(token, clientId, (e, login) => {
                    if (e) return reject(e);
                    const payload = login.getPayload();
                    const userId = payload.sub;
                    return resolve(userId);
                    // If request specified a G Suite domain:
                    // var domain = payload['hd'];
                });
            });
            return verif;
        } catch (err) {
            throw err;
        }
    }

    async facebookAuth(token, appToken) {
        try {
            const apiVersion = 'v2.11';
            const options = {
                uri: `https://graph.facebook.com/${apiVersion}/debug_token`,
                qs: { input_token: token },
                headers: { Authorization: `Bearer ${appToken}` },
                json: true,
            };
            const response = await request(options);
            return response.data.user_id;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new AuthService();

const devService = require('../dev/dev.service');
const userService = require('../user/user.service');
