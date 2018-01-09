// app/dev/dev.model.js

const bcrypt = require('bcryptjs');
const db = require('../db').db;
const mongoose = require('../db').mongoose;
const constants = require('../constants');

const status = constants.status;
const platform = constants.platform;
const tokenIssueConds = constants.tokenIssueConds;

const DevSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        authToken: { type: String },
        status: { type: String, enum: Object.values(status), default: status.pending },
        applications: {
            type: [{
                name: { type: String, required: true },
                status: { type: String, enum: Object.values(status), default: status.pending },
                platform: { type: String, enum: Object.values(platform), required: true },
                tokenIssueConds: { type: [String], enum: Object.values(tokenIssueConds), required: true },
                totalTokensIssued: { type: Number, default: 0 },
                apiKey: { type: String, required: true },
                dailyMaxIssue: { type: Number, default: 0 },
            }],
        },
        pointsAvailable: { type: Number, default: 0 },
        totalPointsEarned: { type: Number, default: 0 },
    },
    {
        timestamps: {
            updatedAt: 'timeUpdated',
            createdAt: 'timeCreated',
        },
    }
);

// hashing a password before saving it to the database
DevSchema.pre('save', async function (next) {
    const dev = this;
    try {
        if (dev.isNew) {
            dev.email = dev.email.trim();
            const hash = await bcrypt.hash(dev.password, parseInt(process.env.SALT, 10));
            dev.password = hash;
        }
        next();
    } catch (err) {
        next(err);
    }
});

// authenticate input against database
DevSchema.statics.authenticate = async (email, password, callback) => {
    try {
        const dev = await db.model('Developer').findOne({ email: email });
        if (!dev) {
            const error = new Error('No developer with the given \'email\'');
            error.status = 401;
            throw error;
        }
        const authenticated = await bcrypt.compare(password, dev.password);
        if (authenticated) return dev;
        const error = new Error('Incorrect password');
        error.status = 401;
        throw error;
    } catch (err) {
        throw err;
    }
};

exports.Model = db.model('Developer', DevSchema);
