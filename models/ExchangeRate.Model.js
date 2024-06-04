const mongoose = require('mongoose');

const ExchangeRateSchema = new mongoose.Schema({
    base: {
        type: String,
        required: true
    },
    rates: {
        type: Map,
        of: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ExchangeRate', ExchangeRateSchema);
