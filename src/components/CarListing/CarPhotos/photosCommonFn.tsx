import { TPhoto } from '@/types/commonTypes';
import axios from 'axios';
import Compressor from 'compressorjs';
import crypto from 'crypto';
// import { createHash } from 'node:crypto';

export const urlToFile = async (url: string, filename: string, mimeType: string) => {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => new File([blob], filename, { type: mimeType }));
};

export const getFilesByUrls = async (photoList: any) => {
  const secureUrls: string[] = [];
  const updatedFiles: any = [];
  await Promise.all(
    photoList?.map((photo: any, index: number) => {
      const url = photo?.imageInfo?.secure_url;
      const parts = url?.split('/');
      const filename = parts[parts?.length - 1]; //get the last string after /
      secureUrls.push(url);
      return urlToFile(url, filename, `image/${photo?.imageInfo?.format}`).then((file: any) => {
        file.publicId = photo?.imageInfo?.public_id;
        updatedFiles.push(file);
      });
    })
  );
  return { secureUrls, updatedFiles };
};

export const saveChatImageListToCloudinary = async (photoList: Blob[], userId: string) => {
  const imageUrlList: any = [];
  const uploadPromises = photoList?.map(async (file) => {
    const { originalWidth, originalHeight } = await getOriginalHeightWidth(file);
    // @ts-ignore
    // const resizedImage: Blob = await minimizeSize(file);
    const tempPhotoName = file.name;

    const formData = new FormData();
    // formData.append('file', resizedImage);
    formData.append('file', file);
    formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);
    const uniquePublicId = getCloudinaryPublicId(`support-ticket-photos/${userId}`, tempPhotoName);
    formData.append('public_id', uniquePublicId);

    const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
    // console.log(response);
    if (response?.status === 200) {
      imageUrlList.push({
        filename: tempPhotoName,
        fileInfo: {
          public_id: response?.data?.public_id,
          secure_url: response?.data?.secure_url,
          format: response?.data?.format,
          bytes: response?.data?.bytes,
          originalWidth,
          originalHeight,
        },
      });
    }
    return response?.data?.secure_url;
  });

  const uploadedUrls = await Promise.all(uploadPromises);
  return { imageUrlList, uploadedUrls };
};

export const saveImageListToCloudinary = async (photoList: Blob[], listingId: string) => {
  const imageUrlList: any = [];
  const uploadPromises = photoList.map(async (file) => {
    const { originalWidth, originalHeight } = await getOriginalHeightWidth(file);
    // @ts-ignore
    const resizedImage: Blob = await minimizeSize(file);
    const tempPhotoName = file.name;
    const formData = new FormData();
    formData.append('file', resizedImage);
    formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);
    const uniquePublicId = getCloudinaryPublicId(`listing-photos/${listingId}`, tempPhotoName);
    formData.append('public_id', uniquePublicId);
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
    // console.log(response);
    if (response?.status === 200) {
      imageUrlList.push({
        imageInfo: {
          public_id: response?.data?.public_id,
          secure_url: response?.data?.secure_url,
          format: response?.data?.format,
          bytes: response?.data?.bytes,
          originalWidth,
          originalHeight,
        },
        storageProvider: 'cloudinary',
      });
    }
    return response?.data?.secure_url;
  });

  const uploadedUrls = await Promise.all(uploadPromises);
  return { imageUrlList, uploadedUrls };
};

const generateSHA1 = (data: any) => {
  const hash = crypto.createHash('sha1');
  // const hash = createHash('sha1');
  hash.update(data);
  return hash.digest('hex');
};

const generateSignature = (publicId: string, apiSecret: string) => {
  const timestamp = new Date().getTime();
  const signatureData = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = generateSHA1(signatureData);
  return {
    signature,
    timestamp,
  };
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    // console.log(publicId);
    const { signature, timestamp } = generateSignature(publicId, `${process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET}`);
    await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`, {
      public_id: `${publicId}`,
      api_key: `${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}`,
      signature,
      timestamp,
    });
  } catch (error) {
    console.log('deletion error', error);
  }
};

export const getOriginalHeightWidth = (selectedFile: Blob): Promise<{ originalWidth: number; originalHeight: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e?.target?.result as string;
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;
        // Now you can use the originalWidth and originalHeight to construct Cloudinary URL
        // const cloudinaryUrl: string = `https://res.cloudinary.com/your-cloud-name/image/upload/w_${originalWidth},h_${originalHeight}/${selectedFile.name}`;
        // Resolve the promise with the original dimensions
        resolve({ originalWidth, originalHeight });
      };
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(selectedFile);
  });
};

export const minimizeSize = async (selectedFile: Blob) => {
  return new Promise((resolve, reject) => {
    new Compressor(selectedFile, {
      quality: 0.8, // Adjust quality as needed
      maxWidth: 800, // Set the maximum width for resizing
      success(result) {
        resolve(result);
      },
      error(error) {
        reject(error);
      },
    });
  });
};

export const saveSingleImageToCloudinary = async (photo: Blob, publicId: string) => {
  let imageUrl: TPhoto = {} as TPhoto;
  let uploadedUrl = null;
  const { originalWidth, originalHeight } = await getOriginalHeightWidth(photo);
  // @ts-ignore
  const resizedImage: Blob = await minimizeSize(photo);
  const tempPhotoName = photo.name;
  const formData = new FormData();
  formData.append('file', resizedImage);
  formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);
  const uniquePublicId = getCloudinaryPublicId(`${publicId}`, tempPhotoName);
  formData.append('public_id', uniquePublicId);

  const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
  // console.log(response);
  if (response?.status === 200) {
    imageUrl = {
      imageInfo: {
        public_id: response?.data?.public_id,
        secure_url: response?.data?.secure_url,
        format: response?.data?.format,
        bytes: response?.data?.bytes,
        originalWidth,
        originalHeight,
      },
      storageProvider: 'cloudinary',
    };
  }

  uploadedUrl = response?.data?.secure_url;
  return { imageUrl, uploadedUrl };
};

export const saveMultipleImageToCloudinary = async (photoList: Blob[], publicId: string) => {
  const imageUrlList: any = [];
  const uploadPromises = photoList.map(async (file) => {
    const { originalWidth, originalHeight } = await getOriginalHeightWidth(file);
    // @ts-ignore
    const resizedImage: Blob = await minimizeSize(file);
    const tempPhotoName = file.name;
    const formData = new FormData();
    formData.append('file', resizedImage);
    formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);
    const uniquePublicId = getCloudinaryPublicId(`${publicId}`, tempPhotoName);
    formData.append('public_id', uniquePublicId);

    const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
    // console.log(response);
    if (response?.status === 200) {
      imageUrlList.push({
        imageInfo: {
          public_id: response?.data?.public_id,
          secure_url: response?.data?.secure_url,
          format: response?.data?.format,
          bytes: response?.data?.bytes,
          originalWidth,
          originalHeight,
        },
        storageProvider: 'cloudinary',
      });
    }
    return response?.data?.secure_url;
  });

  const uploadedUrls = await Promise.all(uploadPromises);
  return { imageUrlList, uploadedUrls };
};

export const getSingleFileByUrl = async (secureUrl: string, format: string, publicId: string) => {
  const parts = secureUrl?.split('/');
  const filename = parts[parts?.length - 1]; //get the last string after /
  return urlToFile(secureUrl, filename, `image/${format}`).then((file: any) => {
    file.publicId = publicId;
    return file;
  });
};

export const getCloudinaryPublicId = (folder: string, filename: string): string => {
  const photoName = filename
    .replace(/\.[^/.]+$/, '')
    .replace(/\s+/g, '_')
    .replace(/&amp;/g, 'and')
    .replace(/[^\w\s]/g, '')
    .trim();

  return `${folder}/${Date.now()}_${photoName}`;
};
