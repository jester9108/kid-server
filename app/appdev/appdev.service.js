// app/appdev/appdev.service.js

'use strict';

const logger = require('../utils').logger;

const AppDevModel = require('./appdev.model').Model;

class AppDevService {
    async appdevMethod() {
        try {
            logger.debug('AppDev log');
            return {
                success: true,
                message: 'AppDev message',
                data: [],
            };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new AppDevService();