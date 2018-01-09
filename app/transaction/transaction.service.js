// app/transaction/transaction.service.js

'use strict';

const logger = require('../utils').logger;
const TokenTx = require('./transaction.model').Model;
const devService = require('../dev/dev.service');
const userService = require('../user/user.service');

class TransactionService {
    async sendToken(txData, apiPayload) {
        try {
            const user = await userService.getUserFromSocialId(txData.recipient, apiPayload);
            const transaction = new TokenTx({
                devId: apiPayload.devId,
                appId: apiPayload.appId,
                userId: user.id,
                tokenAmt: txData.tokenAmt,
                description: txData.description,
            });
            // Update Dev DB
            await devService.issueToken(transaction);
            // Update User DB
            await userService.earnToken(transaction);
            await transaction.save();
            return {
                success: true,
                message: 'Transaction message',
                data: [],
            };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new TransactionService();