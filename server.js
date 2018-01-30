// server.js

'use strict';

require('dotenv').config();

const express = require('express');
// const cors = require('cors');
const bodyParser = require('body-parser');
const oAuth2Server = require('node-oauth2-server');
const mongoDB = require('./app/db');
const logger = require('./app/utils').logger;
const constants = require('./app/resources/constants');
const oAuthModel = require('./app/auth/accessToken.model');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.oauth = oAuth2Server({
    model: oAuthModel,
    grants: ['password'],
    debug: true,
});
app.use(app.oauth.errorHandler());

mongoDB.isReady()
    .then(() => {
        logger.debug('Databases are ready');

        app.use('/', (req, res, next) => {
            req.setTimeout(constants.fullDayMilliseconds);
            logger.debug(`# ${req.method} ${req.path}`);
            next();
        });

        const routes = require('./app/routes')(app.oauth); // eslint-disable-line global-require
        app.use('/api', routes);

        app.use((err, req, res, next) => {
            if (err) {
                let error = err;
                while (error.error) error = error.error;
                logger.error(error);
                res.send({
                    success: false,
                    message: err.message,
                    error: error,
                });
            }
        });

        app.listen(port, () => {
            logger.debug(`Environment (${process.env.NODE_ENV}) live on ${port}`);
        });
    })
    .catch((err) => {
        logger.error(err);
        logger.error('Application failed to launch');
    });
