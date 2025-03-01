import axios from 'axios';

export const getTotalBotRequests = async (startDate, endDate, prevStart, prevEnd) => {
  const response = await axios.get('/api/total-bot-requests', {
    params: { currentStart: startDate, currentEnd: endDate, prevStart, prevEnd }
  });
  return response.data;
};

export const getUniqueURLs = async (startDate, endDate) => {
  const response = await axios.get('/api/unique-urls', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getPercentageErrors = async (startDate, endDate) => {
  const response = await axios.get('/api/percentage-errors', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getMostActiveBot = async (startDate, endDate) => {
  const response = await axios.get('/api/most-active-bot', {
    params: { startDate, endDate }
  });
  return response.data;
};