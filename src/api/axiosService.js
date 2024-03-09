import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://assess.cliniscripts.com:8081/',
});

axiosInstance.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;