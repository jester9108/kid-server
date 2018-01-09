// app/transaction/transaction.model.js

const db = require('../db').db;
const mongoose = require('../db').mongoose;

const transactionSchema = new mongoose.Schema(
    {
        devId: { type: String, required: true },
        appId: { type: String, required: true },
        userId: { type: String, required: true },
        tokenAmt: { type: Number, required: true },
        description: { type: String, maxlength: 40 },
    },
    {
        timestamps: {
            updatedAt: false,
            createdAt: 'timeCreated',
        },
    }
);

exports.Model = db.model('Token-Transaction', transactionSchema);
