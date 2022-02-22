const axios = require('axios');
const conf = require('../../conf/env');

const { API_KEY } = conf;

const { BASE_URL } = process.env;

exports.dailyInfo = async (symbol, timestamp) => {
  const { data: apiResponseData } = await axios.get(
    BASE_URL
    + '?function=TIME_SERIES_DAILY&outputsize=full'
    + `&symbol=${symbol}&apikey=${API_KEY}`
  );

  return {
    data: apiResponseData['Time Series (Daily)'],
    meta: {
      ...apiResponseData['Meta Data'],
      timestamp: timestamp,
      date: timestamp.format('YYYY-MM-DD'),
      dataLenght: Object.keys(apiResponseData['Time Series (Daily)']).length
    }
  };
};
