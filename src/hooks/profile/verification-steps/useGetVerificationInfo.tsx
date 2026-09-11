import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import environment from '@/utils/configs/environment';
import { useQuery } from '@tanstack/react-query';

const apiUrl = environment?.API_URL || '';

const getGetVerificationInfo = async (userId?: string) => {
  const response = await axiosClient.get(`${apiUrl}/v2/verification/${userId}`);
  return response;
};

export const useGetVerificationInfo = () => {
  const { setUserProfileVerificationInfo } = useProfileInfoContext();
  const {
    userCred: { userId, loggedIn },
  } = useUserCredContext();

  return useQuery({
    queryKey: ['verification-info', { userId }],
    queryFn: () => getGetVerificationInfo(userId),
    enabled: !!userId && loggedIn,
    refetchOnWindowFocus: true,
    onSuccess: (data) => {
      // console.log(data?.data?.responseObject);
      setUserProfileVerificationInfo(data?.data?.responseObject);
      return data;
    },
    onError: (err) => {
      console.log('useGetVerificationInfo error', err);
      return err;
    },
  });
};
