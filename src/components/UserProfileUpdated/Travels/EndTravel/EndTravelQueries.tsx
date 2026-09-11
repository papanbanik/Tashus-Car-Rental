import CommonCheckbox from '@/components/Common/CommonCheckbox';
import DisplayRichText from '@/components/Common/DisplayRichText';
import { useTravelContext } from '@/context/TravelProvider';
import Alert from '@mui/material/Alert/Alert';
import Typography from '@mui/material/Typography/Typography';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { TEndQueries } from './EndTravel';
import EndTravelOdometer, { EndTravelOdometerProps } from './EndTravelOdometer';
import EndTravelParking from './EndTravelParking';

export interface IEndTravelQueries extends EndTravelOdometerProps {
  endQueries: TEndQueries;
  setEndQueries: Dispatch<SetStateAction<TEndQueries>>;
  returnInformation?: string;
}

const EndTravelQueries = ({ endQueries, setEndQueries, returnInformation, ...odometerProps }: IEndTravelQueries) => {
  const { updatedTravelData } = useTravelContext();
  const router = useRouter();
  const pathName = usePathname();

  // useEffect(() => {
  //   if (updatedTravelData?.travelType === 'current' && !endQueries?.isCarParkedByGuest) {
  //     router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?view=parking`);
  //   }
  // }, [updatedTravelData, endQueries]);

  const travelQueries = [
    {
      // id: 0,
      id: 'isAnythingLeftChecked',
      title: 'Check inside the car',
      helpingText:
        'Please make sure to properly inspect the interior of the vehicle before returning it. Check the trunk, compartments, and seats to make sure no personal belongings are still inside. Your attentiveness keeps your belongings secure, and the vehicle rental process hassle-free for you as well as the host.',
      checkText: "I have checked i don't have anything left inside the car",
    },
    {
      // id: 1,
      id: 'isCarLockedByGuest',
      title: 'Check if the car is locked',
      helpingText: 'Before leaving the vehicle, please confirm that the car is securely locked. This helps to maintain vehicle security.',
      checkText: 'I have locked the car properly',
    },
    {
      // id: 2,
      id: 'isKeyReturnedByGuest',
      title: 'Return key to partner',
      helpingText: '',
      checkText: 'I have returned the key to the partner',
    },
  ];

  return (
    <div className="travel_container">
      <EndTravelParking />
      {updatedTravelData?.travelType === 'past' ? (
        <Alert severity="success" className="font-bold">
          {'Travel has been completed. Thanks for being with Tashus!'}
        </Alert>
      ) : updatedTravelData?.travelType === 'upcoming' ? (
        <Alert severity="success" className="font-bold">
          {'Travel has not started yet. Thanks for being with Tashus!'}
        </Alert>
      ) : (
        <>
          {travelQueries?.map((travel: any) => (
            <div key={travel.id} className="mb-8">
              <p className="text-xl font-semibold mb-2">{travel.title}</p>
              {travel?.helpingText ? (
                // <Typography variant="body2" className="text-justify text-gray-400 italic">
                //   {travel.helpingText}
                // </Typography>
                <Typography>{travel.helpingText}</Typography>
              ) : (
                <DisplayRichText content={returnInformation || ''}></DisplayRichText>
              )}

              {/* <FormGroup className={`text-primary mt-3`}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        const updatedEndTravelQueries = { ...endQueries } as TEndQueries;
                        updatedEndTravelQueries[travel.id as keyof TEndQueries] = e.target.checked;
                        // console.log(updatedEndTravelQueries);
                        setEndQueries(updatedEndTravelQueries);
                      }}
                      checked={endQueries[travel.id as keyof TEndQueries]}
                      icon={<Unchecked className="text-xl" />}
                      checkedIcon={<Checked className="text-xl" />}
                    />
                  }
                  label={<p className="m-0 font-bold">{travel.checkText}</p>}
                />
              </FormGroup> */}
            </div>
          ))}
          <EndTravelOdometer {...odometerProps}></EndTravelOdometer>
          {/* <FormGroup className={`text-primary mt-3`}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    const updatedEndTravelQueries = { ...endQueries } as TEndQueries;
                    updatedEndTravelQueries['isCarParkedByGuest'] = e.target.checked;
                    updatedEndTravelQueries['isCarLockedByGuest'] = e.target.checked;
                    updatedEndTravelQueries['isAnythingLeftChecked'] = e.target.checked;
                    updatedEndTravelQueries['isKeyReturnedByGuest'] = e.target.checked;
                    // console.log(updatedEndTravelQueries);
                    setEndQueries(updatedEndTravelQueries);
                  }}
                  checked={
                    endQueries['isCarParkedByGuest'] &&
                    endQueries['isCarLockedByGuest'] &&
                    endQueries['isAnythingLeftChecked'] &&
                    endQueries['isKeyReturnedByGuest']
                  }
                  icon={<Unchecked className="text-xl" />}
                  checkedIcon={<Checked className="text-xl" />}
                />
              }
              label={<p className="m-0 font-bold">{`I have followed all of the above Instructions`}</p>}
            />
          </FormGroup> */}
          <CommonCheckbox
            isChecked={
              endQueries['isCarParkedByGuest'] &&
              endQueries['isCarLockedByGuest'] &&
              endQueries['isAnythingLeftChecked'] &&
              endQueries['isKeyReturnedByGuest']
            }
            onChange={(checked) => {
              const updatedEndTravelQueries = { ...endQueries } as TEndQueries;
              updatedEndTravelQueries['isCarParkedByGuest'] = checked;
              updatedEndTravelQueries['isCarLockedByGuest'] = checked;
              updatedEndTravelQueries['isAnythingLeftChecked'] = checked;
              updatedEndTravelQueries['isKeyReturnedByGuest'] = checked;
              setEndQueries(updatedEndTravelQueries);
            }}
            label={<p className="m-0 font-bold">{`I have followed all of the above Instructions`}</p>}
            className={`text-primary mt-3`}
            helpingText="Please tick the checkbox to confirm that you have followed all the instructions mentioned above."
          />
        </>
      )}
    </div>
  );
};

export default EndTravelQueries;
