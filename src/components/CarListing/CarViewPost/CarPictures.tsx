'use client';
import { useCarListingContext } from '@/context/CarListingProvider';
import { getSingularPluralNoun } from '@/utils/Functions/randomCommonFn';
import Image from 'next/image';
import { useState } from 'react';
import CommonZoomModal from '@/components/Common/CommonZoomModal';
const CarPictures = () => {
  const { carData } = useCarListingContext();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const initialCoverPhoto = carData?.photos?.coverPhoto || null;
  const additionalPhotos = carData?.photos?.additionalPhotos || [];
  const allPhotos = [initialCoverPhoto, ...additionalPhotos];
  const allExceptCoverPhoto = [...additionalPhotos];
  const allPhotoUrls = allPhotos.map((p) => p?.imageInfo?.secure_url);

  const showMoreIndex = Math.min(allExceptCoverPhoto?.length - 1, 3);
  const remainingImages = Math.max(allExceptCoverPhoto?.length - 4, 0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === allPhotos?.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? allPhotos?.length - 1 : prevIndex - 1));
  };

  const openCurrentImage = (secure_url) => {
    const _currentImageIndex = allPhotos?.findIndex((photo) => photo?.imageInfo?.secure_url === secure_url);
    setCurrentImageIndex(_currentImageIndex);
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  return (
    <div className="flex items-center justify-center mb-6 " data-testid="image-collage-gallery">
      <div className="flex flex-col md:flex-row mb-6 max-h-[300px] max-w-[1200px] w-full" style={{ overflow: 'hidden' }}>
        <div className="relative md:w-1/2 h-[300px] md:mr-2 cursor-pointer mb-2 md:mb-0">
          <Image
            objectFit="cover"
            fill
            onClick={() => openCurrentImage(carData?.photos?.coverPhoto?.imageInfo?.secure_url)}
            src={carData?.photos?.coverPhoto?.imageInfo?.secure_url ?? ''}
            alt="Featured"
            className="w-full h-full object-cover md:rounded-tl-2xl md:rounded-bl-2xl"
          />
          {allPhotos?.length > 0 && (
            <div className="absolute md:hidden block bottom-0 left-0 w-full text-center mt-2">
              <button
                onClick={() => setModalIsOpen(true)}
                className="bg-black bg-opacity-65 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full h-full min-h-18 md:rounded-br-2xl"
              >
                {`${allPhotos?.length} More ${getSingularPluralNoun('Image', allPhotos?.length)}`}
              </button>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 flex-wrap h-full md:flex hidden">
          <div className="flex w-full h-[150px]">
            <div className="w-1/2 mr-2 mb-2 relative">
              {allExceptCoverPhoto?.length >= 1 ? (
                <Image
                  objectFit="cover"
                  onClick={() => openCurrentImage(allExceptCoverPhoto[0]?.imageInfo?.secure_url)}
                  fill
                  src={allExceptCoverPhoto[0]?.imageInfo?.secure_url}
                  alt="Image 2"
                  className="w-full h-full object-cover cursor-pointer "
                />
              ) : (
                <div className="car_details_no_photo" style={{ border: '1px solid gray' }}>
                  No Photo
                </div>
              )}
            </div>
            <div className="w-1/2 mb-2 border-none relative">
              {allExceptCoverPhoto?.length >= 2 ? (
                <Image
                  objectFit="cover"
                  onClick={() => openCurrentImage(allExceptCoverPhoto[1]?.imageInfo?.secure_url)}
                  fill
                  src={allExceptCoverPhoto[1]?.imageInfo?.secure_url}
                  alt="Image 2"
                  className="w-full h-full object-cover cursor-pointer md:rounded-tr-2xl"
                />
              ) : (
                <div className="car_details_no_photo rounded-tr-2xl" style={{ border: '1px solid gray' }}>
                  No Photo
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row flex-grow border-none">
            <div className={`w-1/2 h-[150px] mr-2 relative ${showMoreIndex === 2 ? 'relative' : ''}`}>
              {allExceptCoverPhoto?.length >= 3 ? (
                <Image
                  objectFit="cover"
                  onClick={() => openCurrentImage(allExceptCoverPhoto[2]?.imageInfo?.secure_url)}
                  fill
                  src={allExceptCoverPhoto[2]?.imageInfo?.secure_url}
                  alt="Image 2"
                  className="w-full h-full object-cover cursor-pointer "
                />
              ) : (
                <div className="car_details_no_photo" style={{ border: '1px solid gray' }}>
                  No Photo
                </div>
              )}
            </div>
            <div className={`w-1/2 h-[150px]  ${showMoreIndex === 3 ? 'relative' : ''}`}>
              {allExceptCoverPhoto?.length >= 4 ? (
                <>
                  <div className="h-[150px]">
                    <Image
                      objectFit="cover"
                      onClick={() => openCurrentImage(allExceptCoverPhoto[3]?.imageInfo?.secure_url)}
                      fill
                      src={allExceptCoverPhoto[3]?.imageInfo?.secure_url}
                      alt="Image 3"
                      className="w-full h-full md:rounded-br-2xl object-cover cursor-pointer "
                    />
                  </div>

                  {remainingImages > 0 && (
                    <div className="absolute bottom-0 left-0 w-full text-center mt-2">
                      <button
                        onClick={() => setModalIsOpen(true)}
                        className="bg-black bg-opacity-65 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full h-full min-h-18 md:rounded-br-2xl"
                      >
                        {`${remainingImages} More ${getSingularPluralNoun('Image', remainingImages)}`}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="car_details_no_photo rounded-br-2xl" style={{ border: '1px solid gray' }}>
                  No Photo
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CommonZoomModal
        open={modalIsOpen}
        onClose={closeModal}
        images={allPhotoUrls}
        currentIndex={currentImageIndex}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
};

export default CarPictures;
