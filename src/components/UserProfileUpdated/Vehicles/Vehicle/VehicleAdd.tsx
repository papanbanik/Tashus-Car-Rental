'use client';
import CarListModal from '@/components/GuestVerification/PartnerVerification/CarListModal';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaFolderOpen } from 'react-icons/fa6';
import { IoAdd } from 'react-icons/io5';

const VehicleAdd = ({ draftList, draftUrl }: { draftList: any; draftUrl: string }) => {
  const router = useRouter();
  const { verificationStatusFlags } = useSearchContext();
  const { handleAddNewListing } = useCarListingContext();
  const { openModal } = useModalContext();
  const handleVehicleList = () => {
    if (Object.values(verificationStatusFlags).some((value) => value === false)) {
      openModal({
        content: <CarListModal handleAddNewListing={handleAddNewListing} />,
      });
    } else {
      handleAddNewListing();
    }
  };
  return (
    <div className="w-full min-h-[45vh] ">
      <div className="flex justify-end p-0 gap-2">
        {draftList?.data?.data?.draftList?.length > 0 && (
          <Button
            className="mb-4 hover:bg-secondary normal-case hover:font-semibold"
            variant="outlined"
            onClick={() => router.push(draftUrl)}
            startIcon={<FaFolderOpen />}
          >
            Show Draft
          </Button>
        )}
        <Button
          onClick={handleVehicleList}
          className="mb-4 hover:bg-secondary normal-case hover:font-semibold"
          variant="outlined"
          startIcon={<IoAdd />}
        >
          Add New
        </Button>
      </div>
      <div className="h-96 w-full bg-secondary rounded-lg flex justify-center items-center relative">
        <p className="absolute top-0 text-lg font-semibold text-primary">No Vehicle Found</p>
        <Image className="mt-6" style={{ objectFit: 'contain' }} src={'/CarListing/no-draft-2.svg'} alt="no draft" fill={true}></Image>
      </div>
    </div>
  );
};

export default VehicleAdd;
