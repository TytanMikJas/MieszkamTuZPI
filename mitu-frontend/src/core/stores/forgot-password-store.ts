import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { axiosInstance } from '../api/axios-instance';

interface InitialForgotPasswordStore {
  tokenValid: {
    value?: boolean;
    loading: boolean;
  };
  passwordChanged: {
    loading: boolean;
    success?: boolean;
  };
}

const initialForgotPasswordStore: InitialForgotPasswordStore = {
  tokenValid: {
    value: undefined,
    loading: false,
  },
  passwordChanged: {
    loading: false,
    success: undefined,
  },
};

export interface ForgotPasswordStore extends InitialForgotPasswordStore {
  validateToken: (token: string) => void;
  changePassword: (
    token: string,
    password: string,
    onSuccess: () => void,
  ) => void;
}

export const useForgotPasswordStore = create<
  ForgotPasswordStore,
  // eslint-disable-next-line prettier/prettier
  [['zustand/devtools', never]]
>(
  devtools((set) => ({
    ...initialForgotPasswordStore,
    validateToken: (token) => {
      set({ tokenValid: { value: undefined, loading: true } });
      axiosInstance
        .get(`/auth/validate-forgot-password-token?token=${token}`)
        .then((response) => {
          console.log(response.data);
          set({ tokenValid: { value: response.data.data, loading: false } });
        })
        .catch(() => {
          set({ tokenValid: { value: false, loading: false } });
        });
    },
    changePassword: (token, password, onSuccess) => {
      set({ passwordChanged: { loading: true, success: undefined } });
      axiosInstance
        .post(`/auth/forgot-password`, { token, password })
        .then(() => {
          set({ passwordChanged: { loading: false, success: true } });
          onSuccess();
        })
        .catch(() => {
          set({ passwordChanged: { loading: false, success: false } });
        });
    },
  })),
);
