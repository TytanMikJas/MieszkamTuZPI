import {
  PerformVote,
  PostComment,
  SetReplyTarget,
  DeleteComment,
  GetDeleteCommentLoading,
  EditComment,
} from '@/types';
import CommentDto from '../api/common/comment/CommentDto';
import { devtools } from 'zustand/middleware';
import { create } from 'zustand';
import { COMMENTS_PAGE_SIZE, SUBCOMMENTS_PAGE_SIZE } from '@/constants';
import { axiosInstance } from '../api/axios-instance';
import EditCommentDto from '../api/common/comment/EditCommentDto';
import { RatingType, RatingDto } from '../api/common/rating/RatingDto';
import { RatingTypeToAttribute } from '../api/common/rating/RatingUtils';
import { SuccessResponse } from '../api/response';

interface CommentSection {
  singleComments: CommentDto[];
  singleCommentCount: number;
  isMoreComments: boolean;
  loadingComments: boolean;
  currentPageComments: number;
  postCommentLoading: boolean;
  deleteCommentLoadingList: string[];
  replyParentId: string | null;
}

const initialCommentSection: CommentSection = {
  singleComments: [],
  singleCommentCount: 0,
  isMoreComments: true,
  loadingComments: false,
  currentPageComments: 0,
  postCommentLoading: false,
  deleteCommentLoadingList: [],
  replyParentId: null,
};

export interface CommentStore extends CommentSection {
  clearComments: () => void;
  fetchComments: (id: string) => void;
  loadMoreSubcomments: (parentNodeId: string) => void;
  performVoteComment: PerformVote;
  perfomVoteSubcomment: PerformVote;
  postComment: PostComment;
  setCommentReplyTarget: SetReplyTarget;
  clearCommentReplyTarget: () => void;
  deleteComment: DeleteComment;
  getLoadingDeleteComment: GetDeleteCommentLoading;
  editComment: EditComment;
  selectCommentById: (
    commentId: string,
    parentNodeId?: string,
  ) => CommentDto | undefined;
  getReplyTarget: () => CommentDto | undefined;
}

export const useCommentStore = create<
  CommentStore,
  [['zustand/devtools', never]]
>(
  devtools((set, get) => ({
    ...initialCommentSection,
    clearComments: () => {
      set({ ...initialCommentSection });
    },
    fetchComments: (id: string) => {
      const {
        loadingComments,
        isMoreComments,
        currentPageComments,
        singleComments,
      } = get();
      if (loadingComments || !isMoreComments) return;
      set({ loadingComments: true });

      axiosInstance
        .get<SuccessResponse<CommentDto[]>>(`/comment/parent/${id}`, {
          params: {
            page: currentPageComments,
            pageSize: COMMENTS_PAGE_SIZE,
            orderBy: 'createdAt',
            sortOrder: 'desc',
          },
        })
        .then((response) => {
          set({
            singleComments: [...singleComments, ...response.data.data],
            currentPageComments: currentPageComments + 1,
            loadingComments: false,
            isMoreComments: response.data.data.length === COMMENTS_PAGE_SIZE,
          });
        })
        .catch((error) => {
          set({ loadingComments: false });
        });
    },
    loadMoreSubcomments: (parentNodeId: string) => {
      const { singleComments } = get();

      const comment = singleComments.find(
        (comment) => `${comment.id}` === parentNodeId,
      );
      if (!comment) return;
      set({
        singleComments: singleComments.map((c) => {
          if (`${c.id}` === parentNodeId) {
            const currentPage = comment.currentPage
              ? comment.currentPage + 1
              : 0;
            return {
              ...c,
              loadingSubcomments: true,
              currentPage,
            };
          }
          return c;
        }),
      });

      axiosInstance
        .get<SuccessResponse<CommentDto[]>>(`/comment/parent/${parentNodeId}`, {
          params: {
            page: comment.currentPage,
            pageSize: SUBCOMMENTS_PAGE_SIZE,
            orderBy: 'createdAt',
            sortOrder: 'desc',
          },
        })
        .then((response) => {
          set({
            singleComments: singleComments.map((c) => {
              if (`${c.id}` === parentNodeId) {
                const cc = c.comments ? c.comments : [];
                return {
                  ...c,
                  comments: [...cc, ...response.data.data],
                  loadingSubcomments: false,
                };
              }
              return c;
            }),
          });
        })
        .catch((error) => {
          set({
            singleComments: singleComments.map((c) => {
              if (`${c.id}` === parentNodeId) {
                return {
                  ...c,
                  loadingSubcomments: false,
                };
              }
              return c;
            }),
          });
        });
    },
    performVoteComment: async (type: RatingType, commentId: string) => {
      const { singleComments } = get();

      const comment = singleComments.find(
        (comment) => `${comment.id}` === commentId,
      );
      if (!comment) return;
      set({
        singleComments: singleComments.map((c) => {
          if (`${c.id}` === commentId) {
            return {
              ...c,
              loadingRating: true,
            };
          }
          return c;
        }),
      });

      axiosInstance
        .post<SuccessResponse<RatingDto>>(`/rating/${type}/${commentId}`)
        .then((response) => {
          set({
            singleComments: singleComments.map((c) => {
              if (`${c.id}` === commentId) {
                const returnedType = response.data.data.type;
                const personalRating = c.personalRating;
                const scoreMatrix = RatingTypeToAttribute(
                  personalRating,
                  type,
                  returnedType,
                );
                scoreMatrix.forEach(([attribute, score]) => {
                  c[attribute] += score;
                });
                c.personalRating = returnedType;
                return {
                  ...c,
                  loadingRating: false,
                };
              }
              return c;
            }),
          });
        })
        .catch((error) => {
          set({
            singleComments: singleComments.map((c) => {
              if (`${c.id}` === commentId) {
                return {
                  ...c,
                  loadingRating: false,
                };
              }
              return c;
            }),
          });
        });
    },
    perfomVoteSubcomment: async (
      type: RatingType,
      commentId: string,
      parentId?: string,
    ) => {
      const { singleComments } = get();

      const comment = singleComments.find(
        (comment) => `${comment.id}` === parentId,
      );
      if (!comment) return;
      set({
        singleComments: singleComments.map((c) => {
          if (`${c.id}` === parentId) {
            return {
              ...c,
              comments: c.comments?.map((cc) => {
                if (`${cc.id}` === commentId) {
                  return {
                    ...cc,
                    loadingRating: true,
                  };
                }
                return cc;
              }),
            };
          }
          return c;
        }),
      });

      axiosInstance
        .post<SuccessResponse<RatingDto>>(`/rating/${type}/${commentId}`)
        .then((response) => {
          set({
            singleComments: singleComments.map((c) => {
              if (`${c.id}` === parentId) {
                const returnedType = response.data.data.type;
                return {
                  ...c,
                  comments: c.comments?.map((cc) => {
                    if (`${cc.id}` === commentId) {
                      const scoreMatrix = RatingTypeToAttribute(
                        cc.personalRating,
                        type,
                        returnedType,
                      );
                      scoreMatrix.forEach(([attribute, score]) => {
                        cc[attribute] += score;
                      });
                      cc.personalRating = returnedType;
                      return {
                        ...cc,
                        loadingRating: false,
                      };
                    }
                    return cc;
                  }),
                };
              }
              return c;
            }),
          });
        })
        .catch((error) => {
          set({
            singleComments: singleComments.map((c) => {
              if (`${c.id}` === parentId) {
                return {
                  ...c,
                  comments: c.comments?.map((cc) => {
                    if (`${cc.id}` === commentId) {
                      return {
                        ...cc,
                        loadingRating: false,
                      };
                    }
                    return cc;
                  }),
                };
              }
              return c;
            }),
          });
        });
    },
    postComment: (id: string, comment: string, files?: File[]) => {
      const {
        singleCommentCount,
        singleComments,
        replyParentId,
        postCommentLoading,
      } = get();
      if (postCommentLoading) return;
      set({ postCommentLoading: true });

      const parentNodeId = replyParentId || `${id}`;
      const subComment = replyParentId !== null;
      const formData = new FormData();
      formData.append('content', comment);
      formData.append('parentNodeId', parentNodeId);
      if (files) {
        files.forEach((file) => {
          formData.append('files', file);
        });
      }

      axiosInstance
        .post<SuccessResponse<CommentDto>>('/comment', formData)
        .then((response) => {
          const comments = singleComments;
          const newComment = response.data.data;
          if (subComment) {
            const parentComment = comments.find(
              (comment) => `${comment.id}` === parentNodeId,
            );
            if (parentComment) {
              const cc = parentComment.comments || [];
              parentComment.comments = [newComment, ...cc];
              parentComment.commentCount += 1;
            }
          } else {
            comments.unshift(newComment);
          }
          set({
            singleComments: comments,
            singleCommentCount: singleCommentCount + 1,
            replyParentId: null,
            postCommentLoading: false,
          });
        })
        .catch((error) => {
          set({ postCommentLoading: false });
        });
    },

    setCommentReplyTarget: (postId: string) => {
      set({ replyParentId: postId });
    },
    clearCommentReplyTarget: () => {
      set({ replyParentId: null });
    },
    getReplyTarget: () => {
      const { singleComments, replyParentId } = get();
      return singleComments.find(
        (comment) => `${comment.id}` === replyParentId,
      );
    },
    deleteComment: (commentId: string, parentNodeId?: string) => {
      const { singleComments, singleCommentCount, deleteCommentLoadingList } =
        get();
      if (deleteCommentLoadingList.includes(commentId)) return;
      set({
        deleteCommentLoadingList: [...deleteCommentLoadingList, commentId],
      });

      axiosInstance
        .delete(`/comment/one/${commentId}`)
        .then(() => {
          const comments = singleComments.filter(
            (comment) => `${comment.id}` !== commentId,
          );
          if (parentNodeId) {
            const parentComment = comments.find(
              (comment) => `${comment.id}` === parentNodeId,
            );
            if (parentComment) {
              parentComment.comments = parentComment.comments?.filter(
                (comment) => `${comment.id}` !== commentId,
              );
              parentComment.commentCount -= 1;
            }
          }
          set({
            singleComments: comments,
            singleCommentCount: singleCommentCount - 1,
            deleteCommentLoadingList: deleteCommentLoadingList.filter(
              (id) => id !== commentId,
            ),
          });
        })
        .catch((error) => {
          set({
            deleteCommentLoadingList: deleteCommentLoadingList.filter(
              (id) => id !== commentId,
            ),
          });
        });
    },
    getLoadingDeleteComment: (commentId: string) => {
      const { deleteCommentLoadingList } = get();
      return deleteCommentLoadingList.includes(commentId);
    },
    editComment: (
      commentId: string,
      content: string,
      onSuccess: () => void,
      parentNodeId?: string,
    ) => {
      const { singleComments, deleteCommentLoadingList } = get();
      if (deleteCommentLoadingList.includes(commentId)) return;
      set({
        deleteCommentLoadingList: [...deleteCommentLoadingList, commentId],
      });

      axiosInstance
        .patch<SuccessResponse<EditCommentDto>>(
          `/comment/content/${commentId}?content=${content}`,
        )
        .then((response) => {
          const comments = singleComments.map((comment) => {
            if (`${comment.id}` === commentId) {
              return {
                ...comment,
                content: response.data.data.content,
                status: response.data.data.status,
              };
            }
            return comment;
          });

          if (parentNodeId) {
            const parentComment = comments.find(
              (comment) => `${comment.id}` === parentNodeId,
            );
            if (parentComment) {
              parentComment.comments = parentComment.comments?.map(
                (comment) => {
                  if (`${comment.id}` === commentId) {
                    return {
                      ...comment,
                      content: response.data.data.content,
                      status: response.data.data.status,
                    };
                  }
                  return comment;
                },
              );
            }
          }
          set({
            singleComments: comments,
            deleteCommentLoadingList: deleteCommentLoadingList.filter(
              (id) => id !== commentId,
            ),
          });
          onSuccess();
        })
        .catch((error) => {
          set({
            deleteCommentLoadingList: deleteCommentLoadingList.filter(
              (id) => id !== commentId,
            ),
          });
        });
    },
    selectCommentById: (commentId: string, parentNodeId?: string) => {
      const { singleComments } = get();
      if (parentNodeId) {
        const parentComment = singleComments.find(
          (comment) => `${comment.id}` === parentNodeId,
        );
        if (parentComment) {
          return parentComment.comments?.find(
            (comment) => `${comment.id}` === commentId,
          );
        }
      }
      return singleComments.find((comment) => `${comment.id}` === commentId);
    },
  })),
);
