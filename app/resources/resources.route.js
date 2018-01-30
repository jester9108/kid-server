// app/resources/constants.route.js

'use strict';

const express = require('express');
const resourcesService = require('./resources.service');

const router = express.Router();

router.get('/:type', async (req, res, next) => {
    try {
        const type = req.params.type;
        if (typeof type === 'undefined') throw new Error('Must provide type');
        res.json(await resourcesService.getValues(type));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
