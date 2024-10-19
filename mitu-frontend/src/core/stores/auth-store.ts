import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import MeDto from '../api/auth/dto/me';
import { axiosInstance } from '../api/axios-instance';
import { SuccessResponse } from '../api/response';
import { CreateUserInputDto } from '../api/auth/dto/register';
import { AxiosError } from 'axios';
import {
  DeleteAccountInputDto,
  UpdateUserEmailInputDto,
  UpdateUserInfoInputDto,
  UpdateUserPasswordInputDto,
} from '../api/auth/dto/editUser';
import { ERROR_SERVER_ERROR } from '@/strings';

export interface AuthStoreError {
  field?: string;
  message: string;
}

export interface AuthStore {
  me: MeDto | null;
  error?: AuthStoreError | null;
  loading?: boolean;
  signIn: (email: string, password: string, onSuccess: () => void) => void;
  fetchMe: () => void;
  logOut: () => void;
  signUp: (signUpDto: CreateUserInputDto, onSuccess: () => void) => void;
  updateUserInfo: (
    updateUserInfoDto: UpdateUserInfoInputDto,
    onSuccess: () => void,
  ) => void;
  updateUserPassword: (
    updateUserInfoDto: UpdateUserPasswordInputDto,
    onSuccess: () => void,
  ) => void;
  updateUserEmail: (
    updateUserInfoDto: UpdateUserEmailInputDto,
    onSuccess: () => void,
  ) => void;
  deleteUserAccount: (
    updateUserInfoDto: DeleteAccountInputDto,
    onSuccess: () => void,
  ) => void;
  forceResetPassword: (oldPassword: string, newPassword: string) => void;
  createForgotPasswordToken: (email: string) => void;
}

export const useAuthStore = create<AuthStore, [['zustand/devtools', never]]>(
  devtools((set, get) => ({
    me: null as MeDto | null,
    error: null as AuthStoreError | null, // Update the type of 'error' property
    loading: false as boolean,
    signIn: (email: string, password: string, onSuccess: () => void) => {
      const { loading, error, me } = get();
      if (loading) return;
      set({ loading: true, error: null, me: null });

      axiosInstance
        .post<SuccessResponse<MeDto>>('/auth/signIn', { email, password })
        .then((response) => {
          set({ me: response.data.data, loading: false });
          onSuccess();
        })
        .catch((error) => {
          set({
            error: { message: error.message },
            loading: false,
          });
        });
    },
    fetchMe: () => {
      const { loading, error, me } = get();
      if (loading) return;
      set({ loading: true });

      axiosInstance
        .get<SuccessResponse<MeDto>>('/auth/me')
        .then((response) => {
          if (response.data.data === me) {
            set({ loading: false, error: null });
            return;
          } else {
            set({ me: response.data.data, loading: false, error: null });
          }
        })
        .catch((error) => {
          if (error?.response?.status === 500) {
            set({
              me: null,
              error: { message: error.message },
              loading: false,
            });
          } else {
            set({
              me: null,
              loading: false,
            });
          }
        });
    },
    logOut: () => {
      const { loading, error, me } = get();
      set({ loading: true, error: null, me: null });

      axiosInstance
        .post<SuccessResponse<MeDto>>('/auth/logout')
        .then((response) => {
          set({ me: null, loading: false });
        })
        .catch((error) => {
          set({
            error: { message: error.message },
            loading: false,
          });
        });
    },

    signUp: (signUpDto: CreateUserInputDto, onSuccess: () => void) => {
      const { loading, error, me } = get();
      if (loading) return;
      set({ loading: true, error: null, me: null });

      axiosInstance
        .post<SuccessResponse<MeDto>>('/auth/signUp', signUpDto)
        .then((response) => {
          set({ me: response.data.data, loading: false });
          onSuccess();
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            const msg = error.response?.data?.data[0]?.messages[0] as string;
            set({
              error: {
                message: msg,
                field: error?.response?.data?.data[0]?.field,
              },
              loading: false,
            });
          } else {
            set({
              error: { message: ERROR_SERVER_ERROR },
              loading: false,
            });
          }
        });
    },

    updateUserInfo: (
      updateUserInfoDto: UpdateUserInfoInputDto,
      onSuccess: () => void,
    ) => {
      const { loading, error, me } = get();
      if (loading) return;
      set({ loading: true, error: null });

      axiosInstance
        .patch<SuccessResponse<MeDto>>(
          '/auth/updateUserInfo',
          updateUserInfoDto,
        )
        .then((response) => {
          set({ loading: false, error: null });
          onSuccess();
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            const msg = error.response?.data?.data[0]?.messages[0] as string;
            set({
              error: {
                message: msg,
                field: error?.response?.data?.data[0]?.field,
              },
              loading: false,
            });
          } else {
            set({
              error: { message: ERROR_SERVER_ERROR },
              loading: false,
            });
          }
        });
    },

    updateUserPassword: (
      updateUserInfoDto: UpdateUserPasswordInputDto,
      onSuccess: () => void,
    ) => {
      const { loading, error, me } = get();
      if (loading) return;
      set({ loading: true, error: null });

      axiosInstance
        .patch<SuccessResponse<MeDto>>(
          '/auth/updateUserPassword',
          updateUserInfoDto,
        )
        .then(() => {
          set({ loading: false, error: null });
          onSuccess();
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            const msg = error.response?.data?.data[0]?.messages[0] as string;
            set({
              error: {
                message: msg,
                field: error?.response?.data?.data[0]?.field,
              },
              loading: false,
            });
          } else {
            set({
              error: { message: ERROR_SERVER_ERROR },
              loading: false,
            });
          }
        });
    },

    updateUserEmail: (
      updateUserInfoDto: UpdateUserEmailInputDto,
      onSuccess: () => void,
    ) => {
      const { loading, error, me } = get();
      if (loading) return;
      set({ loading: true, error: null });

      axiosInstance
        .patch<SuccessResponse<MeDto>>(
          '/auth/updateUserEmail',
          updateUserInfoDto,
        )
        .then(() => {
          set({ loading: false, error: null });
          onSuccess();
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            const msg = error.response?.data?.data[0]?.messages[0] as string;
            set({
              error: {
                message: msg,
                field: error?.response?.data?.data[0]?.field,
              },
              loading: false,
            });
          } else {
            set({
              error: { message: ERROR_SERVER_ERROR },
              loading: false,
            });
          }
        });
    },

    deleteUserAccount: (
      updateUserInfoDto: DeleteAccountInputDto,
      onSuccess: () => void,
    ) => {
      const { loading, error, me } = get();
      if (loading) return;
      set({ loading: true, error: null });

      axiosInstance
        .post<SuccessResponse<MeDto>>(
          '/auth/deleteUserAccount',
          updateUserInfoDto,
        )
        .then(() => {
          set({ loading: false, error: null });
          onSuccess();
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            const msg = error.response?.data?.data[0]?.messages[0] as string;
            set({
              error: {
                message: msg,
                field: error?.response?.data?.data[0]?.field,
              },
              loading: false,
            });
          } else {
            set({
              error: { message: ERROR_SERVER_ERROR },
              loading: false,
            });
          }
        });
    },

    forceResetPassword: (oldPassword, newPassword) => {
      const { loading, error, me } = get();
      axiosInstance
        .patch('/auth/forceResetPassword', {
          oldPassword,
          password: newPassword,
        })
        .then(() => {
          set({
            me: {
              ...me!,
              forceChangePassword: false,
            },
            loading: false,
          });
        })
        .catch((error) => {
          set({
            loading: false,
          });
        });
    },

    createForgotPasswordToken: (email: string) => {
      axiosInstance.post(`/auth/create-forgot-password-token?email=${email}`);
    },
  })),
);
