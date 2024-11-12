import React from 'react';
import CommentablePostSentimentOutputDTO from '../api/sentiment/sentiment';
import { axiosInstance } from '../api/axios-instance';
type Props = {};

function useSentiment({}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] =
    React.useState<CommentablePostSentimentOutputDTO | null>(null);

  function fetch(postId: number) {
    setLoading(true);
    axiosInstance
      .get(`/sentiment/${postId}`)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  }

  return {
    loading,
    data,
    fetch,
  };
}

export default useSentiment;
