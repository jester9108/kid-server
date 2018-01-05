// app/transaction/transaction.service.js

'use strict';

const logger = require('../utils').logger;

const TransactionModel = require('./transaction.model').Model;

class TransactionService {
    async transactionMethod() {
        try {
            logger.debug('Transaction log');
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