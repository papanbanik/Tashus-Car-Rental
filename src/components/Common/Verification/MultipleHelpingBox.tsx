import { CommonHelpingBoxProps, MultipleHelpingBoxProps } from '@/types/user-verification/verificationListingSteps';
import { Button, Divider } from '@mui/material';
import CommonHelpingBox from './CommonHelpingBox';

const MultipleHelpingBox = ({ helpingBoxes, setDrawerOpen }: MultipleHelpingBoxProps) => {
  return (
    <div className="border border-solid border-accent rounded-lg p-4 pt-8 h-full">
      {helpingBoxes?.map((box: CommonHelpingBoxProps, index: number) => (
        <div key={index}>
          <CommonHelpingBox {...box} />
          {index < helpingBoxes?.length - 1 && <Divider className="my-2" />}
        </div>
      ))}
      {setDrawerOpen && (
        <div className="flex justify-center mt-4">
          <Button variant="contained" color="primary" onClick={() => setDrawerOpen(false)} className="normal-case">
            I Understood
          </Button>
        </div>
      )}
    </div>
  );
};

export default MultipleHelpingBox;
