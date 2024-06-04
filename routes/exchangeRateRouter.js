const express = require('express');
const { fetchExchangeRates, getLatestExchangeRates } = require('../controllers/exchangeRateController');

const router = express.Router();

router.get('/fetch-exchange-rates', fetchExchangeRates);
router.get('/exchange-rates', getLatestExchangeRates);

module.exports = router;
