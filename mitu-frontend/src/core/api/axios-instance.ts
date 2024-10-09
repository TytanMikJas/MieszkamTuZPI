import axios from 'axios';
import { router, ROUTES } from '../routing/Router';
import { emitErrors } from './error-utils';
import { emitSuccessMessage } from './success-utils';
export const axiosInstance = axios.create({
  baseURL: '/api',
});

axiosInstance.interceptors.response.use(
  (res) => {
    emitSuccessMessage(res);
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._4XXFromRefresh &&
      !originalRequest.url.includes('/auth/refreshToken')
    ) {
      try {
        const response = await axiosInstance.post('/auth/refreshToken');
        if(response.status === 201) {
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        originalRequest._4XXFromRefresh = true;
        if (!originalRequest.url.includes('/auth/me')) {
          router.navigate(ROUTES.MAP.LOGIN.path());
        }
        return Promise.reject(error);
      }
    } else {
      emitErrors(error);
    }
    return Promise.reject(error);
  },
);

window.axios = axiosInstance;
