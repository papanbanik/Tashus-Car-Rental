'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type ContactDetailsSave = {
  userId: string | undefined;
  contactData: {
    contactDetails: any;
    secondaryContact: any;
  };
};

const updateContactDetails = async ({ userId, contactData }: ContactDetailsSave) => {
  // console.log('Contact Data....', contactData);
  const response = await axiosClient.put(`${apiUrl}/profile/contact-details/${userId}`, contactData);
  // console.log('response', response);
  return response;
};

export const useContactDetails = () => {
  const { profileContactDetails, setProfileContactDetails } = useProfileInfoContext();
  return useMutation({
    mutationFn: ({ userId, contactData }: ContactDetailsSave) => updateContactDetails({ userId, contactData }),
    onSuccess: (data, variables) => {
      // console.log('contact-details updt res', variables);
      const { contactData } = variables;
      const { residentialAddress, postalAddress, email, phone } = contactData?.contactDetails || {};
      setProfileContactDetails({
        ...profileContactDetails,
        contactDetails: {
          residentialAddress,
          postalAddress,
          email,
        },
        phone,
        secondaryContact: contactData?.secondaryContact || {},
      });

      // console.log('Info', profileContactDetails);
      return data;
    },
    onError: (err) => {
      console.log('useContactDetails error', err);
      return err;
    },
  });
};
