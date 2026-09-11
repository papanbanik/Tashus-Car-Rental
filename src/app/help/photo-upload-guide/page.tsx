import PhotoUploadGuide from '@/components/Help/PhotoUploadGuide/PhotoUploadGuide';
import { allMetaData } from '@/utils/Functions/metaData';
const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;

const pageMetadata = allMetaData?.find((item) => item.route === '/help/photo-upload-guide');

export const metadata = {
  title: pageMetadata?.title ?? 'Photo Upload Guide | Tashus Rent a car service Sydney',
  description:
    pageMetadata?.description ??
    'Step-by-step guide on how to upload photos for Tashus car rentals. Ensure a smooth and easy process for uploading your documents and vehicle images.',

  alternates: {
    canonical: `${DOMAIN}/help/photo-upload-guide`,
  },
};

const PhotoUploadGuidePage = () => {
  return (
    <div>
      <PhotoUploadGuide />
    </div>
  );
};

export default PhotoUploadGuidePage;
