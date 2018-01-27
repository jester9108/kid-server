// app/transaction/transaction.service.js

'use strict';

const logger = require('../utils').logger;
const TokenTx = require('./transaction.model').Model;
const storeService = require('../store/store.service');
const userService = require('../user/user.service');
const tokenService = require('../token/token.service.js');

class TransactionService {
    // async sendToken(txData, apiPayload) {
    //     try {
    //         const user = await userService.getUserFromSocialId(txData.recipient, apiPayload);
    //         const transaction = new TokenTx({
    //             devId: apiPayload.devId,
    //             appId: apiPayload.appId,
    //             userId: user.id,
    //             tokenAmt: txData.tokenAmt,
    //             description: txData.description,
    //         });
    //         // Generate tokens
    //         await tokenService.generateTokens(transaction);
    //         // Update Dev DB
    //         await storeService.issueToken(transaction);
    //         // Update User DB
    //         await userService.earnToken(transaction);
    //         // Save transaction
    //         await transaction.save();
    //         return {
    //             success: true,
    //             message: 'Transaction message',
    //             data: [],
    //         };
    //     } catch (err) {
    //         throw err;
    //     }
    // }
}

module.exports = new TransactionService();