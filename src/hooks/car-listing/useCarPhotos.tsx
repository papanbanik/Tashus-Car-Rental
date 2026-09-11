'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type CarCoverPhotoSave = {
  listingId: string;
  imageInfo: any;
  listingSteps: any;
};

type CarMultiplePhotoSave = {
  listingId: string;
  imageUrlList: any;
  listingSteps: any;
};

//Inspection Photo
type CarInspectionPhotoSave = {
  listingId: string;
  hostId: string | undefined;
  imageUrlList: any;
  listingSteps: any;
};

const saveCarCoverPhoto = async ({ listingId, imageInfo, listingSteps }: CarCoverPhotoSave) => {
  // console.log(listingId, imageInfo);

  const response = await axiosClient.post(`${apiUrl}/listing/upload-single-cover/${listingId}`, {
    imageInfo,
    listingSteps,
  });
  return response;
};

export const useSaveCarCoverPhoto = () => {
  const { handleSaveCurrentStep, carData, setCarData, setIsUploading, isUploading } = useCarListingContext();

  return useMutation({
    mutationFn: ({ listingId, imageInfo, listingSteps }: CarCoverPhotoSave) => saveCarCoverPhoto({ listingId, imageInfo, listingSteps }),
    onSuccess: (data, variables) => {
      // console.log(data);
      // console.log(data?.data?.data);
      const { imageInfo } = variables;
      const photos = {
        ...carData?.photos,
        coverPhoto: {
          imageInfo,
        },
      };
      setCarData({ ...carData, photos });
      // handleSaveCurrentStep(6, data?.data?.data?.listingId);
    },
    onError: (err: any) => {
      console.log('useSaveCarCoverPhoto mutation error', err);
      setIsUploading({ ...isUploading, coverPhoto: false });
      return err;
    },
  });
};

const saveCarAdditionalPhotos = async ({ listingId, imageUrlList, listingSteps }: CarMultiplePhotoSave) => {
  // console.log(listingId, imageUrlList);

  const response = await axiosClient.post(`${apiUrl}/listing/upload-additional-photos/${listingId}`, {
    imageUrlList,
    listingSteps,
  });
  return response;
};

export const useSaveAdditionalPhotos = () => {
  const { handleSaveCurrentStep, carData, setCarData, setIsUploading, isUploading } = useCarListingContext();

  return useMutation({
    mutationFn: ({ listingId, imageUrlList, listingSteps }: CarMultiplePhotoSave) =>
      saveCarAdditionalPhotos({ listingId, imageUrlList, listingSteps }),
    onSuccess: (data, variables) => {
      // console.log(data);
      // console.log(data?.data?.data);
      const { imageUrlList } = variables;

      const photos = {
        ...carData?.photos,
        additionalPhotos: imageUrlList,
      };
      setCarData({ ...carData, photos });
      // handleSaveCurrentStep(6, data?.data?.data?.listingId);
    },
    onError: (err: any) => {
      console.log('useSaveAdditionalPhotos mutation error', err);
      setIsUploading({ ...isUploading, additionalPhotos: false });
      return err;
    },
  });
};

const saveCarInitialPhotos = async ({ listingId, imageUrlList, listingSteps }: CarMultiplePhotoSave) => {
  // console.log(listingId, imageUrlList);

  const response = await axiosClient.post(`${apiUrl}/listing/upload-initial-photos/${listingId}`, {
    imageUrlList,
    listingSteps,
  });
  return response;
};

export const useSaveInitialPhotos = () => {
  const { handleSaveCurrentStep, carData, setCarData, setIsUploading, isUploading } = useCarListingContext();

  return useMutation({
    mutationFn: ({ listingId, imageUrlList, listingSteps }: CarMultiplePhotoSave) => saveCarInitialPhotos({ listingId, imageUrlList, listingSteps }),
    onSuccess: (data, variables) => {
      // console.log(data);
      // console.log(data?.data?.data);
      const { imageUrlList } = variables;

      const photos = {
        ...carData?.photos,
        initialConditionPhotos: imageUrlList,
      };
      setCarData({ ...carData, photos });
      // handleSaveCurrentStep(6, data?.data?.data?.listingId);
    },
    onError: (err: any) => {
      console.log('useSaveInitialPhotos mutation error', err);
      setIsUploading({ ...isUploading, initialPhotos: false });
      return err;
    },
  });
};

//Inspection Photo
const saveCarInspectionPhoto = async ({ listingId, hostId, imageUrlList, listingSteps }: CarInspectionPhotoSave) => {
  const response = await axiosClient.put(`${apiUrl}/listing/vehicle-inspection-photo/${listingId}/${hostId}`, {
    hostId,
    imageUrlList,
    listingSteps,
  });
  return response;
};

export const useSaveCarInspectionPhoto = () => {
  const { handleSaveCurrentStep, carData, setCarData, setIsUploading, isUploading } = useCarListingContext();

  return useMutation({
    mutationFn: ({ listingId, hostId, imageUrlList, listingSteps }: CarInspectionPhotoSave) =>
      saveCarInspectionPhoto({ listingId, hostId, imageUrlList, listingSteps }),
    onSuccess: (data, variables) => {
      // console.log(data);
      // console.log(data?.data);
      // console.log(data?.data?.data);
      // console.log(carData);
      const { imageUrlList } = variables;
      // console.log(imageUrlList);
      // const photos = {
      //   ...carData?.photos,
      //   vehicleInspectionPhotos: {
      //     imageUrlList,
      //   },
      // };
      const photos = {
        ...carData?.photos,
        vehicleInspectionPhotos: imageUrlList,
      };
      // console.log(photos);
      setCarData({ ...carData, photos });
      // console.log(carData);
      // handleSaveCurrentStep(6, data?.data?.data?.listingId);
    },
    onError: (err: any) => {
      console.log('useSaveCarCoverPhoto mutation error', err);
      setIsUploading({ ...isUploading, inspectionPhoto: false });
      return err;
    },
  });
};
