import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import NewsletterDto from '../api/newsletter/newsletter-dto';
import NewsletterInfoDto from '../api/newsletter/newsletter-info-dto';
import { axiosInstance } from '../api/axios-instance';
import { SuccessResponse } from '../api/response';
import CreateNewsletterDto from '../api/newsletter/create-newsletter-dto';
import EditNewsletterDto from '../api/newsletter/edit-newsletter-dto';
import ParsedNewsletterDto from '../api/newsletter/parsed-newsletter-dto';

interface InitialNewsletterStore {
  newsletter?: ParsedNewsletterDto;
  newsletterInfoList: NewsletterInfoDto[];
}

const initialNewsletterStore: InitialNewsletterStore = {
  newsletter: undefined,
  newsletterInfoList: [],
};

export interface NewsletterStore extends InitialNewsletterStore {
  fetchNewsletterById: (id: number) => void;
  fetchAllNewsletterInfo: () => void;
  createNewsletter: (
    newsletter: CreateNewsletterDto,
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void,
  ) => void;
  updateNewsletter: (
    newsletter: EditNewsletterDto,
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void,
  ) => void;
  deleteNewsletter: (
    id: number,
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void,
  ) => void;
  sendNewsletter: (
    id: number,
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void,
  ) => void;
  reset(): void;
  isListLoading: boolean;
  isNewsletterLoading: boolean;
  isCreateLoading: boolean;
  isUpdateLoading: boolean;
  isDeleteLoading: boolean;
  isSendLoading: boolean;
}

export const useNewsletterStore = create<
  NewsletterStore,
  [['zustand/devtools', never]]
>(
  devtools((set, get) => ({
    ...initialNewsletterStore,
    isListLoading: false,
    isNewsletterLoading: false,
    isCreateLoading: false,
    isUpdateLoading: false,
    isDeleteLoading: false,
    isSendLoading: false,
    fetchNewsletterById: (id: number) => {
      set({ isNewsletterLoading: true, newsletter: undefined });
      axiosInstance
        .get<SuccessResponse<NewsletterDto>>(`/newsletter/${id}`)
        .then((res) => {
          set({
            newsletter: {
              ...res.data.data,
              edjsNewsletter: res.data.data.edjsNewsletter
                ? JSON.parse(res.data.data.edjsNewsletter)
                : undefined,
            },
            isNewsletterLoading: false,
          });
        })
        .catch((err) => {
          console.error(err);
          set({ isNewsletterLoading: false });
        });
    },
    fetchAllNewsletterInfo: () => {
      set({ isListLoading: true });
      axiosInstance
        .get<SuccessResponse<NewsletterInfoDto[]>>('/newsletter')
        .then((res) => {
          set({ newsletterInfoList: res.data.data, isListLoading: false });
        })
        .catch((err) => {
          console.error(err);
          set({ isListLoading: false });
        });
    },
    createNewsletter: (
      newsletter: CreateNewsletterDto,
      onSuccess: (msg: string) => void,
      onError: (msg: string) => void,
    ) => {
      set({ isCreateLoading: true });
      axiosInstance
        .put<SuccessResponse<NewsletterDto>>('/newsletter', {
          ...newsletter,
        })
        .then((res) => {
          const newsletter: ParsedNewsletterDto = {
            ...res.data.data,
            edjsNewsletter: res.data.data.edjsNewsletter
              ? JSON.parse(res.data.data.edjsNewsletter)
              : undefined,
          };
          set({ newsletter: newsletter, isCreateLoading: false });
          //sort the list by id
          set((state) => ({
            newsletterInfoList: [
              ...state.newsletterInfoList,
              { id: newsletter.id, name: newsletter.name },
            ].sort((a, b) => b.id - a.id),
          }));
          onSuccess('Newsletter został utworzony');
        })
        .catch((err) => {
          console.error(err);
          set({ isCreateLoading: false });
          onError('Nie udało się utworzyć newslettera');
        });
    },
    updateNewsletter: (
      newsletter: EditNewsletterDto,
      onSuccess: (msg: string) => void,
      onError: (msg: string) => void,
    ) => {
      set({ isUpdateLoading: true });
      console.log(newsletter);
      axiosInstance
        .patch<SuccessResponse<NewsletterDto>>(`/newsletter`, {
          ...newsletter,
        })
        .then((res) => {
          const newsletter: ParsedNewsletterDto = {
            ...res.data.data,
            edjsNewsletter: res.data.data.edjsNewsletter
              ? JSON.parse(res.data.data.edjsNewsletter)
              : undefined,
          };
          console.log(newsletter);
          set({ newsletter: newsletter, isUpdateLoading: false });
          set((state) => ({
            newsletterInfoList: state.newsletterInfoList.map(
              (newsletterInfo) =>
                newsletterInfo.id === newsletter.id
                  ? { id: newsletter.id, name: newsletter.name }
                  : newsletterInfo,
            ),
          }));
          onSuccess('Newsletter został zaktualizowany');
        })
        .catch((err) => {
          console.error(err);
          set({ isUpdateLoading: false });
          onError('Nie udało się zaktualizować newslettera');
        });
    },
    deleteNewsletter: (
      id: number,
      onSuccess: (msg: string) => void,
      onError: (msg: string) => void,
    ) => {
      set({ isDeleteLoading: true });
      axiosInstance
        .delete<SuccessResponse<NewsletterDto>>(`/newsletter/${id}`)
        .then((res) => {
          set({ isDeleteLoading: false });
          set((state) => ({
            newsletterInfoList: state.newsletterInfoList.filter(
              (newsletter) => newsletter.id !== id,
            ),
          }));
          set({ newsletter: undefined });
          onSuccess('Newsletter został usunięty');
        })
        .catch((err) => {
          console.error(err);
          set({ isDeleteLoading: false });
          onError('Nie udało się usunąć newslettera');
        });
    },
    sendNewsletter: (
      id: number,
      onSuccess: (msg: string) => void,
      onError: (msg: string) => void,
    ) => {
      set({ isSendLoading: true });
      axiosInstance
        .post<SuccessResponse<NewsletterDto>>(`/newsletter/send/${id}`)
        .then((res) => {
          set({ isSendLoading: false });
          onSuccess('Newsletter został wysłany');
        })
        .catch((err) => {
          console.error(err);
          set({ isSendLoading: false });
          onError('Nie udało się wysłać newslettera');
        });
    },
    reset: () => {
      set(initialNewsletterStore);
    },
  })),
);
