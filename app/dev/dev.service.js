// app/dev/dev.service.js

'use strict';

const jwt = require('jsonwebtoken');
const logger = require('../utils').logger;
const Developer = require('./dev.model').Model;
const authMessage = require('../auth/auth.message');

class DevService {
    async issueToken(transaction) {
        try {
            const dev = await Developer.findOne({ _id: transaction.devId });
            // TODO: Check if app daily maximum is not reached
            let numApps = dev.applications.length;
            while (numApps) {
                const app = dev.applications[numApps - 1];
                if (app._id === transaction.appId) {
                    app.totalTokensIssued += transaction.tokenAmt;
                    break;
                }
                numApps -= 1;
            }
            await dev.save();
        } catch (err) {
            throw err;
        }
    }

    async integrateApplication(params) {
        try {
            const dev = await Developer.findOne({ _id: params.devId });
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
    }

    async register(devData) {
        try {
            logger.debug('Creating new developer...');
            const dev = new Developer(devData);
            await dev.save();
            return {
                success: true,
                message: `New developer (${dev.email}) created`,
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

    async getDeveloper(email, password) {
        try {
            const dev = await Developer.authenticate(email, password);
            return dev;
        } catch (err) {
            throw err;
        }
    }

    async getDeveloperFromBearerToken(bearerToken) {
        try {
            const dev = await Developer.findOne({ authToken: bearerToken });
            return dev;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new DevService();
