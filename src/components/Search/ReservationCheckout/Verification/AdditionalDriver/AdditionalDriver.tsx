import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import Button from '@mui/material/Button/Button';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { MdVerified } from 'react-icons/md';
import AdditionalDriverModal from './AdditionalDriverModal';

const AdditionalDriver = () => {
  const pathName = usePathname();
  const { openModal } = useModalContext();
  const { additionalDrivers, setAdditionalDrivers } = useSearchContext();
  const { carData, setCarData } = useCarListingContext();

  useEffect(() => {
    setAdditionalDrivers([]);
  }, []);

  // useEffect(() => {
  //   console.log(carData?.additionalDrivers);
  //   if (pathName?.includes('insurance-policy') && carData?.additionalDrivers?.length > 0) {
  //     // const newDrivers = carData?.additionalDrivers.map(({ isActive, _id, createdAt, updatedAt, ...rest }: any) => rest);
  //     const newDrivers = carData?.additionalDrivers.map(({ requestId, isActive, status, _id, createdAt, updatedAt, ...rest }: any) => ({
  //       isActive,
  //       requestId,
  //       status,
  //       createdAt,
  //       updatedAt,
  //       ...rest,
  //     }));
  //     console.log(newDrivers);
  //     console.log(carData?.additionalDrivers);
  //     setAdditionalDrivers(newDrivers);
  //     console.log(additionalDrivers);
  //   }
  // }, [carData?.additionalDrivers, pathName]);

  useEffect(() => {
    // console.log(carData?.additionalDrivers);
    if (pathName?.includes('insurance-policy') && (carData?.additionalDrivers?.length ?? 0) > 0) {
      const newDrivers = carData?.additionalDrivers?.map(({ requestId, isActive, status, _id, createdAt, updatedAt, ...rest }: any) => ({
        _id,
        isActive,
        requestId,
        status,
        createdAt,
        updatedAt,
        ...rest,
      }));
      const keepLatestOccurrence = (drivers: any) => {
        const latestOccurrenceMap = new Map();
        drivers.forEach((driver: any) => {
          latestOccurrenceMap.set(driver.email, driver);
        });
        return Array.from(latestOccurrenceMap.values());
      };

      const filteredDrivers = keepLatestOccurrence(newDrivers);
      // console.log(filteredDrivers);
      const filteredActiveDrivers = filteredDrivers.filter((driver: any) => driver.isActive === true);

      // console.log(filteredActiveDrivers);
      setAdditionalDrivers(filteredActiveDrivers);
      // console.log(additionalDrivers);
    }
  }, [carData?.additionalDrivers, pathName]);

  const handleAddDriver = () => {
    openModal({
      title: 'Add Additional Driver',
      modalWidth: 'md',
      content: <AdditionalDriverModal setData={setCarData} dataCar={carData}></AdditionalDriverModal>,
    });
  };

  return (
    <div className="grid grid-cols-12">
      <p className="md:col-span-4 col-span-6 m-0">Additional Driver</p>
      <div className="md:col-span-8 col-span-6 flex justify-end items-center gap-2">
        {additionalDrivers?.length > 0 && (
          <>
            <span className="text-gray-400">Added {additionalDrivers?.length}</span>
            <MdVerified className={'text-success'} />
          </>
        )}
        <Button size="small" className="normal-case underline text-md font-semibold" onClick={handleAddDriver}>
          {additionalDrivers?.length > 0 ? 'Update' : 'Add'}
        </Button>
      </div>
    </div>
  );
};

export default AdditionalDriver;
