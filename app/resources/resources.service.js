// app/resources/constants.service.js

'use strict';

const constants = require('./constants');

class Constants {
    async getValues(type) {
        try {
            const success = constants.hasOwnProperty(type)
            return {
                success: success,
                message: `Fetch ${success ? 'successful' : 'failed'}`,
                data: constants[type],
            };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new Constants();
