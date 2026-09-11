import { useModalContext } from '@/context/ModalProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ResendEmailResponse, ResendEmailValues } from '../../types/user-verification/ResendEmail';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const resendEmail = async ({ userId, email }: ResendEmailValues): Promise<ResendEmailResponse> => {
  const response = await axios.put(`${apiUrl}/auth/resend-email`, {
    email,
    userId,
  });
  const finalResponse: ResendEmailResponse = { ...response.data };
  return finalResponse;
};

export const useResendEmail = () => {
  const { setUserCred } = useUserCredContext();
  const queryClient = useQueryClient();
  const { openSnackBar } = useSnackBarContext();
  const { closeModal } = useModalContext();
  return useMutation({
    mutationFn: ({ userId, email }: ResendEmailValues) => resendEmail({ userId, email }),
    onSuccess: (data) => {
      const {
        data: { email, userId },
      } = data;
      setUserCred({ userId, email, loggedIn: true });
      const tashus = JSON.parse(localStorage.getItem('tashus') || '{}');
      localStorage.setItem('tashus', JSON.stringify({ ...tashus, userId, email, loggedIn: true }));
      queryClient.invalidateQueries(['userDetails', userId]);
      openSnackBar({
        message: data?.message || 'Email sent Successfully',
        severity: 'success',
      });
      closeModal();
    },
    onError: (err: any) => {
      console.log('useResendEmail mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'An error occurred while sending the email.',
        severity: 'error',
      });
      return err;
    },
  });
};
