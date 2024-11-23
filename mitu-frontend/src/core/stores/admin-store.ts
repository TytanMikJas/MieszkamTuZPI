import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SuccessResponse } from '../api/response';
import { axiosInstance } from '../api/axios-instance';
import { AdminSidebarStage } from '@/types';
import { ADMIN_NONE_STAGE } from '@/strings';
import CreateOfficialInputDto from '../api/admin/CreateOfficialInputDto';
import CreateOfficialDto from '../api/admin/CreateOfficialDto';
import { UserPublicExtendedDto } from '../api/admin/UserPublicDto';

interface ListSection {
  userList: UserPublicExtendedDto[];
  selectedUser: UserPublicExtendedDto | null;
  loadingList: boolean;
}

interface ManagementSection {
  stage: AdminSidebarStage;
  generatePassworadLoading: boolean;
  newPassword: string | null;
  createLoading: boolean;
}

export interface AdminStore extends ListSection, ManagementSection {
  fetchUserList: () => void;
  setStage: (stage: AdminSidebarStage, callback?: () => void) => void;
  setSelectedUser: (user: UserPublicExtendedDto | null) => void;
  getIsSelected: (id: string) => boolean;
  patchGeneratePassword: () => void;
  clearPasswordGeneration: () => void;
  postCreateUser: (user: CreateOfficialInputDto) => void;
}

const initialListSection: ListSection = {
  userList: [],
  selectedUser: null,
  loadingList: false,
};

const initialManagementSection: ManagementSection = {
  stage: ADMIN_NONE_STAGE,
  generatePassworadLoading: false,
  newPassword: null,
  createLoading: false,
};

export const useAdminStore = create<
  AdminStore,
  // eslint-disable-next-line prettier/prettier
  [['zustand/devtools', never]]
>(
  devtools((set, get) => ({
    ...initialListSection,
    ...initialManagementSection,
    fetchUserList: () => {
      const { userList, loadingList } = get();
      if (loadingList) return;
      set({
        loadingList: true,
      });
      axiosInstance
        .get<SuccessResponse<UserPublicExtendedDto[]>>('/admin/users', {
          params: {
            orderBy: 'lastName',
            sortOrder: 'asc',
          },
        })
        .then((response) => {
          set({
            userList: response.data.data,
            loadingList: false,
          });
        })
        .catch(() => {
          set({
            loadingList: false,
          });
        });
    },
    setStage: (stage: AdminSidebarStage, callback?) => {
      set({
        stage,
      });
      if (callback) callback();
    },
    setSelectedUser: (user: UserPublicExtendedDto | null) => {
      set({
        selectedUser: user,
      });
    },
    getIsSelected: (id: string) => {
      const { selectedUser } = get();
      return selectedUser?.id === id;
    },
    patchGeneratePassword: () => {
      const { selectedUser, generatePassworadLoading } = get();
      if (!selectedUser || generatePassworadLoading) return;
      set({
        generatePassworadLoading: true,
      });

      axiosInstance
        .patch<SuccessResponse<string>>(`/admin/password/${selectedUser.id}`)
        .then((response) => {
          set({
            newPassword: response.data.data,
            generatePassworadLoading: false,
          });
        })
        .catch(() => {
          set({
            newPassword: null,
            generatePassworadLoading: false,
          });
        });
    },
    clearPasswordGeneration: () => {
      set({
        newPassword: null,
        generatePassworadLoading: false,
      });
    },
    postCreateUser: (user) => {
      const { createLoading, userList } = get();
      if (createLoading) return;
      set({
        createLoading: true,
      });

      axiosInstance
        .post<SuccessResponse<CreateOfficialDto>>('/admin/official', user)
        .then((response) => {
          set({
            createLoading: false,
            userList: [...userList, response.data.data.user],
            newPassword: response.data.data.password,
          });
        })
        .catch(() => {
          set({
            createLoading: false,
          });
        });
    },
  })),
);
