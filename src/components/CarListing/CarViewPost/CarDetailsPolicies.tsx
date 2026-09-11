import Policies from '@/components/Common/VehicleDetails/Policies';
import { useUserCredContext } from '@/context/UserCredProvider';
import { ECommonValue } from '@/utils/Functions/randomCommonFn';
import { Divider, Typography } from '@mui/material';
const CarDetailsPolicies = () => {
  const { userProfileInfo, isDepositSetByAdmin, userCred } = useUserCredContext();
  const fixedDeposit = !!userProfileInfo?.customFixedDeposit ? userProfileInfo?.customFixedDeposit : ECommonValue.HoldDepositAmount;
  const showInitialDeposit = userCred?.loggedIn
    ? (userProfileInfo?.guestTotalTrips < 1 || userProfileInfo?.isDepositApplicable) && !userProfileInfo?.isDepositWaived
    : false;
  return (
    <div className="w-full">
      {showInitialDeposit ? (
        <>
          <Divider className="bg-primary my-3" />
          <div>
            <Typography className="font-bold text-md">Initial Deposit: {`$${fixedDeposit}`}</Typography>
            <Typography className="text-sm text-justify">
              {`Dear valued guest! For this reservation, we will hold`} <b>{`$${fixedDeposit}`}</b>{' '}
              {`as a deposit for incidental charges. Any remaining amount, or the full
                deposit if no charges apply, will be refunded after the successful completion of your reservation.${
                  isDepositSetByAdmin ? '' : ` Please note, this is a one-time charge and won't be applied to any of your future reservations.`
                } Thank you for your understanding!`}
            </Typography>
          </div>

          <Divider className="bg-primary my-3" />
        </>
      ) : (
        ''
      )}
      <Policies />
    </div>
  );
};

export default CarDetailsPolicies;
