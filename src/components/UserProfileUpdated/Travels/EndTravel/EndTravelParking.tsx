import DisplayRichText from '@/components/Common/DisplayRichText';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { FaLocationDot } from 'react-icons/fa6';

// const EndTravelParking = ({ endQueries, setEndQueries }: IEndTravelQueries) => {
const EndTravelParking = () => {
  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();

  return (
    <div>
      {/* <div className="travel_container"> */}
      {updatedTravelData?.travelType === 'past' ? (
        // <Alert severity="success" className="font-bold">
        //   {'Travel has been completed. Thanks for being with Tashus!'}
        // </Alert>
        <></>
      ) : updatedTravelData?.travelType === 'upcoming' ? (
        // <Alert severity="success" className="font-bold">
        //   {'Travel has not started yet. Thanks for being with Tashus!'}
        // </Alert>
        <></>
      ) : (
        <>
          <p className="text-xl font-semibold">Parking Instructions</p>

          {travelDetails?.pickupAddress && (
            <div className="flex items-center gap-4 mb-8">
              <FaLocationDot size={24} className="text-gray-500" />{' '}
              <span className="text-medium text-gray-700 italic">
                {travelDetails?.pickupAddress?.street || `${travelDetails?.pickupAddress?.city}, ${travelDetails?.pickupAddress?.state}`}
              </span>
            </div>
          )}

          <DisplayRichText content={travelDetails?.parkingInstructions}></DisplayRichText>

          {/* <FormGroup className={`text-primary mt-10`}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    const updatedEndTravelQueries = { ...endQueries };
                    updatedEndTravelQueries['isCarParkedByGuest'] = e.target.checked;
                    setEndQueries(updatedEndTravelQueries);
                  }}
                  checked={endQueries.isCarParkedByGuest}
                  icon={<Unchecked className="text-xl" />}
                  checkedIcon={<Checked className="text-xl" />}
                />
              }
              label={<p className="m-0 font-bold">I have parked the car with the proper instruction given by the partner</p>}
            />
          </FormGroup> */}
        </>
      )}
    </div>
  );
};

export default EndTravelParking;
