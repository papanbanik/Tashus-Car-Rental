import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { IoMdAdd } from 'react-icons/io';

const VehicleActions = ({ draftCount, draftUrl }: { draftCount: number; draftUrl: string }) => {
  const router = useRouter();
  const vehicleUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/car-listing`;
  return (
    <div className="flex justify-between md:justify-normal gap-2">
      {draftCount > 0 && (
        <div className="md:w-1/6">
          <Button
            variant="outlined"
            size="small"
            color="primary"
            className="normal-case flex justify-start bg-transparent"
            onClick={() => router.push(draftUrl)}
          >
            {`Show Draft (${draftCount})`}
          </Button>
        </div>
      )}
      <div>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          className="normal-case flex justify-start bg-transparent"
          onClick={() => router.push(vehicleUrl)}
          startIcon={<IoMdAdd />}
        >
          {`List another Vehicle`}
        </Button>
      </div>
    </div>
  );
};

export default VehicleActions;
