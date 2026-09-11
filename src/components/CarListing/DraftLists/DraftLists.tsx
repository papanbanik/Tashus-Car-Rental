'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useDraftCarList } from '@/hooks/profile/useDraftCarList';
import { useCarListingSteps } from '@/hooks/useCarListing';
import { Button, Container, Skeleton, Typography } from '@mui/material';
import { IoAdd } from 'react-icons/io5';
import DraftCard from './DraftCard';
// import NoDraft from '../../../../public/CarListing/no-draft.png';
import CarListModal from '@/components/GuestVerification/PartnerVerification/CarListModal';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import Image from 'next/image';

const DraftLists = () => {
  const { data, refetch, isLoading } = useDraftCarList();
  const isIPadPro = useIPadProQuery();
  const { setEnableListSteps, updateLocalListingId, handleAddNewListing } = useCarListingContext();
  const { data: steps } = useCarListingSteps();
  const { verificationStatusFlags } = useSearchContext();
  // const [loading, setLoading] = useState<boolean>(true);
  const { openModal } = useModalContext();
  const handleContinueListing = async (draft: any, lastCompletedStep: any) => {
    // console.log(draft);
    const { listingId, listingSteps } = draft;
    // console.log(listingId, listingSteps);
    await updateLocalListingId(listingId);
    setEnableListSteps(true);
    // updateCurrentCarSteps(lastCompletedStep, listingSteps, listingId);
  };

  // let x = 0;
  // useEffect(() => {
  //   if (data) {
  //     setLoading(false);
  //   } else {
  //     const loadingTimeout = setTimeout(() => {
  //       setLoading(false);
  //     }, 2000);
  //     return () => {
  //       clearTimeout(loadingTimeout);
  //     };
  //   }
  // }, [data]);
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
    <div className="lg:mx-36 md:mx-12 mx-8 mt-32 mb-16">
      <Typography className="font-semibold text-center lg:text-4xl text-2xl mb-8">
        <span>Draft </span>
        <span className="text-primary">Lists</span>
        <span className="text-success">_</span>
      </Typography>
      <Container className="flex justify-end p-0">
        <Button
          // onClick={handleAddNewListing}
          onClick={handleVehicleList}
          className="mb-4 hover:bg-secondary normal-case hover:font-semibold"
          variant="outlined"
          startIcon={<IoAdd />}
        >
          Add New
        </Button>
      </Container>
      {isLoading ? (
        <>
          <Skeleton className="mt-20" />
          <Skeleton animation="wave" />
        </>
      ) : (
        <>
          {/* <div className="bg-white rounded-xl lg:px-24 lg:py-12 grid lg:grid-cols-3 gap-3 grid-cols-1"> */}
          {data?.data?.data?.draftList?.length > 0 ? (
            // {x !== 0 ? (
            <div className={`grid ${isIPadPro ? 'grid-cols-2' : 'lg:grid-cols-4'} md:grid-cols-2 grid-cols-1 gap-3`}>
              {data?.data?.data?.draftList?.map((draft: any) => (
                <DraftCard key={draft?._id} draft={draft} handleContinueListing={handleContinueListing}></DraftCard>
              ))}
            </div>
          ) : (
            <div className="h-96 bg-secondary rounded-lg flex justify-center items-center relative">
              <p className="absolute top-0 text-lg font-semibold text-primary">No Draft Found</p>
              <Image className="mt-6" style={{ objectFit: 'contain' }} src={'/CarListing/no-draft-2.svg'} alt="no draft" fill={true}></Image>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DraftLists;
