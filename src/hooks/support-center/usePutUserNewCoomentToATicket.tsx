'use client';

import { useGetAllCommentsOfATicketContext } from '@/context/AllCommentsOfATicketProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { AddUserNewCommentType } from '@/types/componentTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const addUserNewComment = async ({ status, commentData, ticketId }: AddUserNewCommentType) => {
  // console.log('addUserNewComment', status, commentData);
  // const { adminId } = JSON.parse(localStorage.getItem('adminData') || '{}');
  const response = await axiosClient.put(`${apiUrl}/support-ticket/comment-user/${ticketId}`, {
    status,
    commentData,
  });
  // console.log(response);
  return response;
};

export const useAddUserNewComment = () => {
  const { allComments, setAllComments } = useGetAllCommentsOfATicketContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ status, commentData, ticketId }: AddUserNewCommentType) => addUserNewComment({ status, commentData, ticketId }),
    onSuccess: (data, variables) => {
      const updatedAllComments = { ...allComments };
      updatedAllComments.comments = [...allComments.comments, data.data.lastComment];
      setAllComments(updatedAllComments);
      openSnackBar({
        message: data?.data?.message || 'Message Added successfully',
        severity: 'success',
      });
      return data;
    },
    onError: (err: any) => {
      console.log('useAddUserNewComment page mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || err?.message || 'Error Saving Message',
        severity: 'error',
      });
      return err;
    },
  });
};
