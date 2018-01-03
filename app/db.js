// app/db.js

'use strict';

const logger = require('./utils').logger;
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird').Promise;

let db;

const dbPromise = new Promise((resolve, reject) => {
    const dbUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PW}@ds123400.mlab.com:23400/${process.env.DB_HOST}`;
    db = mongoose.createConnection(dbUri, { useMongoClient: true });
    db.once('open', () => {
        logger.debug('CastrDB connected');
        resolve(db);
    });
    db.on('error', (err) => {
        logger.error('CastrDB connection failed');
        reject(new Error(err.message));
    });
});

module.exports = {
    isReady() { return Promise.all([dbPromise]); },
    db: db,
    mongoose: mongoose,
};
