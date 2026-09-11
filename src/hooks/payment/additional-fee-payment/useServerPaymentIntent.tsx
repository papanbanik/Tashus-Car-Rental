'use server';

import { PaymentDataInfo } from '@/types/payment/additionalFeeReservation';
import environment from '@/utils/configs/environment';
import { EncryptionService } from '@/utils/Functions/payment/encryption';
import axios from 'axios';

const apiUrl = environment?.API_URL;

export type AdditionalFeePaymentIntentResult = {
  decryptedClientSecret: string;
};

export async function createPaymentIntent(additionalFeePaymentData: PaymentDataInfo, accessToken: string): Promise<AdditionalFeePaymentIntentResult> {
  const response = await axios.post(`${apiUrl}/v2/payment/additional-fee-intent`, additionalFeePaymentData, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  // console.log('Intent Response', response?.data);
  let decryptedClientSecret: string = '';
  const encryptionService = new EncryptionService();
  // Decrypt the client secret
  if (!!response?.data?.responseObject?.clientSecret) {
    decryptedClientSecret = encryptionService.decrypt(response?.data?.responseObject?.clientSecret);
    // console.log('Decrypted Client Secret:', decryptedClientSecret);
  }

  return {
    decryptedClientSecret,
  };
}
