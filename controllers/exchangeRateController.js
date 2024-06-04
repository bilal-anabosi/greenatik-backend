const axios = require('axios');
const ExchangeRate = require('../models/ExchangeRate.Model');

const fetchExchangeRates = async (req, res) => {
    try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const rates = response.data.rates;

        const exchangeRate = new ExchangeRate({
            base: 'USD',
            rates,
            date: new Date()
        });

        await exchangeRate.save();
        console.log('Exchange rates saved to database');
        res.status(200).json({ message: 'Exchange rates saved to database' });
    } catch (error) {
        console.error('Error fetching exchange rates:', error.message);
        res.status(500).json({ error: 'Error fetching exchange rates' });
    }
};

const getLatestExchangeRates = async (req, res) => {
    try {
        const rates = await ExchangeRate.findOne().sort({ date: -1 });
        res.json(rates);
    } catch (error) {
        console.error('Error fetching exchange rates from database:', error.message);
        res.status(500).json({ error: 'Error fetching exchange rates from database' });
    }
};

module.exports = {
    fetchExchangeRates,
    getLatestExchangeRates
};
