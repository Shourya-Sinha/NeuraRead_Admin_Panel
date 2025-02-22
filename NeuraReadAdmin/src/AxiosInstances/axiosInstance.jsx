import axios from 'axios';

const axiosInstances = axios.create({
  baseURL: 'https://neuraread-admin-panel.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ New function to attach token dynamically
export const setAuthToken = (token) => {
  if (token) {
    axiosInstances.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstances.defaults.headers.Authorization;
  }
};

axiosInstances.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error Response:', error.response);
      if (error.response.status === 500) {
        return Promise.reject({ message: 'Server error, please try again later.' });
      } else if (error.response.status === 404) {
        return Promise.reject({ message: 'Resource not found.' });
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response from server. Please check your network.' });
    } else {
      console.error('Error during request setup:', error.message);
      return Promise.reject({ message: 'An error occurred during the request.' });
    }
  }
);

export default axiosInstances;
