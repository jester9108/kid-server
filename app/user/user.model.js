// app/user/user.model.js

const bcrypt = require('bcryptjs');
const db = require('../db').db;
const mongoose = require('../db').mongoose;
const constants = require('../constants');

const status = constants.status;

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        authToken: { type: String },
        status: { type: String, enum: Object.values(status), default: status.pending },
        socialIds: {
            type: {
                _id: false,
                google: { type: String },
                facebook: { type: String },
            },
            default: {},
        },
        identity: {
            type: {
                _id: false,
                gender: { type: String, enum: ['MALE', 'FEMALE'], required: true },
                dob: { type: String, required: true },
            },
            required: true,
        },
        gameList: {
            type: [{
                _id: false,
                appId: { type: String, required: true },
                totalTokensEarned: { type: Number, default: 0 },
            }],
        },
        pointsAvailable: { type: Number, default: 0 },
        totalPointsEarned: { type: Number, default: 0 },
        dailyMaxEarn: { type: Number, default: 0 },
    },
    {
        timestamps: {
            updatedAt: 'timeUpdated',
            createdAt: 'timeCreated',
        },
    }
);

// hashing a password before saving it to the database
UserSchema.pre('save', async function (next) {
    const user = this;
    try {
        if (user.isNew) {
            user.email = user.email.trim();
            const hash = await bcrypt.hash(user.password, parseInt(process.env.SALT, 10));
            user.password = hash;
        }
        next();
    } catch (err) {
        next(err);
    }
});

// authenticate input against database
UserSchema.statics.authenticate = async (email, password, callback) => {
    try {
        const user = await db.model('User').findOne({ email: email });
        if (!user) {
            const error = new Error('No user with the given \'username\'');
            error.status = 401;
            throw error;
        }
        const authenticated = await bcrypt.compare(password, user.password);
        if (authenticated) return user;
        const error = new Error('Incorrect password');
        error.status = 401;
        throw error;
    } catch (err) {
        throw err;
    }
};

exports.Model = db.model('User', UserSchema);
