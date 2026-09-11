'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { Card, IconButton, Slider, Tooltip } from '@mui/material';
import { MdNavigateNext } from 'react-icons/md';

const DraftCard = ({ draft, handleContinueListing }: any) => {
  const { getLastStep } = useCarListingContext();
  let lastCompletedStep = getLastStep(draft?.listingSteps);
  // console.log(lastCompletedStep);

  return (
    <Card className="p-4 bg-[#80008033] flex-row justify-center items-center">
      <div className="text-center">
        <span className="font-semibold">
          {draft?.car?.licensePlate?.number} ({draft?.car?.licensePlate?.state})
          {/* License Plate: {draft?.car?.licensePlate?.number} ({draft?.car?.licensePlate?.state}) */}
        </span>
        <p className="capitalize mt-0">
          {draft?.car?.make.toLowerCase()} {draft?.car?.model.toLowerCase()}
        </p>
      </div>
      <div className="flex justify-center items-center gap-4">
        <Slider
          defaultValue={(lastCompletedStep?.step * 100) / 9}
          disabled
          sx={{
            '& .MuiSlider-thumb': {
              display: 'none',
            },
            '&.MuiSlider-root.Mui-disabled': {
              color: '#800080',
            },
          }}
        />
        <p className="px-2 font-bold">
          <span className="text-success">{lastCompletedStep?.step}</span>
          <span className="text-primary">/9</span>
        </p>
      </div>
      <div className="text-center">
        <Tooltip enterTouchDelay={0} title="Continue Listing" placement="top">
          <IconButton onClick={() => handleContinueListing(draft, lastCompletedStep)} className="bg-primary text-white font-extrabold">
            <MdNavigateNext size={25} />
          </IconButton>
        </Tooltip>
      </div>
    </Card>
  );
};

export default DraftCard;
