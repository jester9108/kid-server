// app/dev/dev.model.js

const bcrypt = require('bcryptjs');
const db = require('../db').db;
const mongoose = require('../db').mongoose;
const constants = require('../constants');

const status = constants.status;
const amenities = constants.amenities;

function arrayLimit(val) { return val.length <= 10; }
function ageRange(val) { return val.max >= val.min; }

const AdminSchema = new mongoose.Schema({
    _id: false,
    name: { type: String, required: true },
    phone: { type: String, required: false },
});
const SettingsSchema = new mongoose.Schema({
    _id: false,
    name: { type: String, maxlength: 25, required: true },
    address: { type: String, required: false },
    description: { type: String, maxlength: 140, required: false },
    phone: { type: String, required: false },
    website: { type: String, required: false },
    tag: { type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 10'], required: false },
    age: {
        type: {
            _id: false,
            min: { type: Number, min: 0, max: 18 },
            max: { type: Number, min: 0, max: 18 },
        },
        default: { min: 0, max: 18 },
        validate: [ageRange, '{PATH}.max must be greater than or equal to {PATH}.min'],
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
    amenities: { type: [String], enum: Object.values(amenities), required: false },
    images: { type: [String], required: false },
});
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    description: { type: String, maxlength: 140, required: true },
    quantity: { type: Number, min: 1, default: 1 },
    tag: { type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 10'], required: false },
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

const StoreSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        authToken: { type: String, required: false },
        status: { type: String, enum: Object.values(status), default: status.pending },
        admin: { type: AdminSchema, default: AdminSchema },
        settings: { type: SettingsSchema, default: SettingsSchema },
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
    },
    {
        timestamps: {
            updatedAt: 'timeUpdated',
            createdAt: 'timeCreated',
        },
    }
);

// hashing a password before saving it to the database
StoreSchema.pre('save', async function (next) {
    const store = this;
    try {
        if (store.isNew) {
            store.email = store.email.trim();
            const hash = await bcrypt.hash(store.password, parseInt(process.env.SALT, 10));
            store.password = hash;
        }
        next();
    } catch (err) {
        next(err);
    }
});

// authenticate input against database
StoreSchema.statics.authenticate = async (email, password, callback) => {
    try {
        const store = await db.model('Store').findOne({ email: email });
        if (!store) {
            const error = new Error('No store with the given \'email\'');
            error.status = 401;
            throw error;
        }
        const authenticated = await bcrypt.compare(password, store.password);
        if (authenticated) return store;
        const error = new Error('Incorrect password');
        error.status = 401;
        throw error;
    } catch (err) {
        throw err;
    }
};

exports.Model = db.model('Store', StoreSchema);
