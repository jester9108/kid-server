// app/store/store.model.js

const bcrypt = require('bcryptjs');
const db = require('../db').db;
const mongoose = require('../db').mongoose;
const aws = require('../aws/aws.service');
const constants = require('../resources/constants');

const Status = constants.Status;
const AmenityType = constants.AmenityType;

function checkArraySize(val) { return val.length <= 10; }
function checkAge(val) { return val.max >= val.min; }

const SettingsSchema = new mongoose.Schema({
    _id: false,
    name: { type: String, maxlength: 25, required: true },
    address: { type: String, required: false },
    description: { type: String, maxlength: 140, required: false },
    phone: { type: String, required: false },
    website: { type: String, required: false },
    tag: { type: [String], validate: [checkArraySize, '{PATH} exceeds the limit of 10'], required: false },
    age: {
        type: {
            _id: false,
            min: { type: Number, min: 0, max: 18 },
            max: { type: Number, min: 0, max: 18 },
        },
        default: { min: 0, max: 18 },
        validate: [checkAge, '{PATH}.max must be greater than or equal to {PATH}.min'],
    },
    maxCapacity: { type: Number, min: 1, default: 100 },
    openHour: {
        type: [{
            _id: false,
            days: { type: [Number], required: true },
            start: { type: String, maxlength: 4, required: true },
            end: { type: String, maxlength: 4, required: true },
        }],
        required: false,
    },
    amenities: { type: [String], enum: Object.values(AmenityType), required: false },
    images: { type: [String], required: false },
});
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    description: { type: String, maxlength: 140, required: true },
    quantity: { type: Number, min: 1, default: 1 },
    tag: { type: [String], validate: [checkArraySize, '{PATH} exceeds the limit of 10'], required: false },
    note: { type: String, maxlength: 140, required: false },
    refundable: { type: Boolean, default: false },
    refundWindow: {
        type: {
            _id: false,
            window: { type: Number, min: 1, required: true },
            type: { type: String, enum: ['DAY', 'WEEK'], required: true },
        },
        required: false,
    },
    images: { type: [String], required: false },
});
const BankAccountSchema = new mongoose.Schema({
    _id: false,
    accountNumber: { type: String, required: false },
    bankName: { type: String, required: false },
    accountHolderName: { type: String, required: false },
});
const AdminSchema = new mongoose.Schema({
    _id: false,
    name: { type: String, required: true },
    phone: { type: String, required: false },
    bizRegCert: { type: Object, required: true },
});

const StoreSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        accessToken: { type: String, required: false },
        status: { type: String, enum: Object.values(Status), default: Status.pending },
        store: { type: SettingsSchema, default: SettingsSchema },
        menu: {
            type: [{
                _id: false,
                name: { type: String, required: true },
                menu: {
                    type: [{
                        _id: false,
                        name: { type: String, required: true },
                        price: { type: Number, required: true },
                    }],
                },
            }],
            required: false,
        },
        products: { type: [ProductSchema], required: false },
        bankAccount: { type: BankAccountSchema, default: BankAccountSchema },
        admin: { type: AdminSchema, default: AdminSchema },
    },
    {
        timestamps: {
            updatedAt: 'timeUpdated',
            createdAt: 'timeCreated',
        },
    }
);

// (Runs after validation) - Hashing a password before saving it to the database
StoreSchema.pre('save', async function (next) {
    const Store = db.model('Store');
    const store = this;
    try {
        if (store.isNew) {
            store.email = store.email.trim();
            await Store.checkEmail(store.email);
            const hash = await store.schema.statics.hashPassword(store.password, parseInt(process.env.SALT, 10));
            store.password = hash;
            const uploadResult = await aws.uploadToBucket('kid-businesses', store, 'bizRegCert', store.admin.bizRegCert);
            store.admin.bizRegCert = { url: uploadResult.Location };
        }
        next();
    } catch (err) {
        next(err);
    }
});

StoreSchema.statics.hashPassword = async function (password) {
    try {
        return bcrypt.hash(password, parseInt(process.env.SALT, 10));
    } catch (err) {
        throw err;
    }
};

// Authenticate input against database
StoreSchema.statics.authenticate = async function (email, password) {
    try {
        const Store = this; // db.model('Store')
        const store = await Store.findOne({ email: email, status: { $ne: Status.deleted } });
        if (!store) {
            const error = new Error('No store with the given \'email\'');
            error.status = 401;
            throw error;
        }
        const authenticated = await store.matchPassword(password);
        if (authenticated) return store;
        const error = new Error('Incorrect password');
        error.status = 401;
        throw error;
    } catch (err) {
        throw err;
    }
};

// Check for a duplicate email
StoreSchema.statics.checkEmail = async function (email) {
    try {
        const Store = this; // db.model('Store')
        const dupeEmail = await Store.findOne({ email: email, status: { $ne: Status.deleted } });
        if (dupeEmail) throw new Error('Invalid params: Email already in use');
    } catch (err) {
        throw err;
    }
};

// Match password
StoreSchema.methods.matchPassword = async function (password) {
    try {
        const store = this;
        return bcrypt.compare(password, store.password);
    } catch (err) {
        throw err;
    }
};

exports.Model = db.model('Store', StoreSchema);
