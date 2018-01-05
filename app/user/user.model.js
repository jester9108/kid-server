// app/user/user.model.js

const bcrypt = require('bcryptjs');
const db = require('../db').db;
const mongoose = require('../db').mongoose;
const constants = require('../constants');

const status = constants.status;

const UserSchema = new mongoose.Schema(
    {
        // _id: mongoose.SchemaTypes.ObjectId,
        email: { type: String, unique: true, required: true, trim: true },
        password: { type: String, required: true },
        authToken: String,
        status: { type: Number, enum: Object.values(status), required: true },
    },
    {
        timestamps: {
            updatedAt: 'timeUpdated',
            createdAt: 'timeCreated',
        },
    }
);

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

// hashing a password before saving it to the database
UserSchema.pre('save', async function (next) {
    const user = this;
    try {
        const hash = await bcrypt.hash(user.password, parseInt(process.env.SALT, 10));
        user.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});

exports.Model = db.model('User', UserSchema);
