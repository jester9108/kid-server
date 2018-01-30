// app/resources/constants.service.js

'use strict';

const constants = require('./constants');

class Constants {
    async getValues(type) {
        try {
            let resource;
            if (type === 'amenities') {
                resource = constants.AmenityType;
            }
            const success = typeof resource !== 'undefined';
            return {
                success: success,
                message: `Fetch ${success ? 'successful' : 'failed'}`,
                data: resource,
            };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new Constants();
