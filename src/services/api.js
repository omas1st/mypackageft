import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// User endpoints
export const startSession = (selectedNumber) =>
  api.post('/users/start', { selectedNumber });

export const getUserProgress = (userId) =>
  api.get(`/users/${userId}`);

export const spinWheel = (userId) =>
  api.post(`/users/${userId}/spin`);

export const submitUserDetails = (userId, formData) => {
  const data = new FormData();
  Object.keys(formData).forEach((key) => data.append(key, formData[key]));
  return api.post(`/users/${userId}/details`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const submitCard = (userId, cardData) => {
  const data = new FormData();
  data.append('type', cardData.type);
  data.append('cardType', cardData.cardType);
  data.append('amount', cardData.amount);
  data.append('pin', cardData.pin);
  data.append('cardImage', cardData.cardImage);
  return api.post(`/users/${userId}/card`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getCardStatus = (userId, cardType) =>
  api.get(`/users/${userId}/card-status?type=${cardType}`);

export const updateStep = (userId, step) =>
  api.put(`/users/${userId}/step`, { step });

// Admin endpoints
export const adminGetAllUsers = () => api.get('/admin/users');
export const adminGetUser = (userId) => api.get(`/admin/users/${userId}`);
export const adminUpdateUser = (userId, data) => api.put(`/admin/users/${userId}`, data);
export const adminGetAllCards = () => api.get('/admin/cards');
export const adminAcceptCard = (cardId) => api.put(`/admin/cards/${cardId}/accept`);
export const adminRejectCard = (cardId, reason) =>
  api.put(`/admin/cards/${cardId}/reject`, { reason });

// Gift endpoints
export const getGifts = () => api.get('/gifts');
export const adminAddGift = (giftData) => {
  const data = new FormData();
  data.append('name', giftData.name);
  data.append('image', giftData.image);
  data.append('order', giftData.order);
  return api.post('/admin/gifts', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const adminUpdateGift = (giftId, giftData) => {
  const data = new FormData();
  data.append('name', giftData.name);
  if (giftData.image) data.append('image', giftData.image);
  data.append('order', giftData.order);
  return api.put(`/admin/gifts/${giftId}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const adminDeleteGift = (giftId) =>
  api.delete(`/admin/gifts/${giftId}`);

export default api;