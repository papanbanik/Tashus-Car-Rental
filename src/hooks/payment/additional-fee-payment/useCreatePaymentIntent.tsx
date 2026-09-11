import { useTravelContext } from '@/context/TravelProvider';
import { PaymentDataInfo } from '@/types/payment/additionalFeeReservation';
import axiosClient from '@/utils/configs/axiosInstance';
import { EncryptionService } from '@/utils/Functions/payment/encryption';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL_V2;

export type TAdditionalFeePaymentInfo = {
  additionalFeePaymentData: PaymentDataInfo;
};

const createPaymentIntent = async ({ additionalFeePaymentData }: TAdditionalFeePaymentInfo) => {
  // console.log({ ...verificationInfoByPartner });
  const userCred = JSON.parse(localStorage.getItem('tashus') as string);
  const response = await axiosClient.post(
    `${apiUrl}/payment/additional-fee-intent`,
    {
      ...additionalFeePaymentData,
    },
    {
      headers: {
        authorization: `Bearer ${userCred?.accessToken}`,
      },
    }
  );

  return response;
};

export const useCreatePaymentIntent = () => {
  const { setClientSecret } = useTravelContext();
  return useMutation({
    mutationFn: ({ additionalFeePaymentData }: TAdditionalFeePaymentInfo) => createPaymentIntent({ additionalFeePaymentData }),
    onSuccess: (data) => {
      // console.log('Payment Intent', data?.data?.responseObject);
      const encryptionService = new EncryptionService();
      // Decrypt the client secret
      if (!!data?.data?.responseObject?.clientSecret) {
        const decryptedClientSecret = encryptionService.decrypt(data?.data?.responseObject?.clientSecret);
        setClientSecret(decryptedClientSecret);
        // console.log('Decrypted Client Secret:', decryptedClientSecret);
      }
      return data;
    },
    onError: (err: any) => {
      console.log('useCreatePaymentIntent mutation error', err);
      return err;
    },
  });
};
