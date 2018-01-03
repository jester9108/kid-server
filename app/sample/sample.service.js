// app/sample/sample.service.js

'use strict';

const logger = require('../utils').logger;

const SampleModel = require('./sample.model').Model;

class SampleService {
    async sampleMethod() {
        try {
            logger.debug('Sample log');
            return {
                success: true,
                message: 'Sample message',
                data: [],
            };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new SampleService();