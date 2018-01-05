// app/appdev/appdev.model.js

const db = require('../db').db;
const mongoose = require('../db').mongoose;

const appdevSchema = new mongoose.Schema(
    {
        _id: mongoose.SchemaTypes.ObjectId,
        numberKey: { type: Number, required: true },
        stringKey: { type: String, enum: ['A', 'B', 'C'], required: true },
        dateKey: { type: Date, default: new Date() },
        booleanKey: { type: Boolean, required: false },
        arrayKey: { type: [String], required: false },
        objectKey: {
            _id: false,
            key0: Object,
            key1: Object,
        },
    },
    {
        timestamps: {
            updatedAt: 'timeUpdated',
            createdAt: 'timeCreated',
        },
    }
);

exports.Model = db.model('AppDev', appdevSchema);
