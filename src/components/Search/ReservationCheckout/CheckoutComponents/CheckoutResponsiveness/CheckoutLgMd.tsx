import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider'; // Import Context
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { CheckoutProps } from '@/types/checkout/checkoutTypes';
import { getVerificationFlags } from '@/utils/Functions/verification/verificationFn';
import { Button, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import HoldCoveredCredit from '../../Checkout/HoldCoveredCredit';

const CheckoutLg = ({ handleCheckout, isLoading, depositMessage, totalAmountError, confirmButtonDisabled }: CheckoutProps) => {
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const isIPadPro = useIPadProQuery();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { reservationDepositAmount = 0 } = useSearchContext();
  const verificationFlags = getVerificationFlags(userProfileVerificationInfo);
  return (
    <>
      <div className={`${isIPadPro ? '' : 'lg:w-full lg:justify-center'} flex flex-col justify-end items-center gap-4`}>
        <Button
          fullWidth={isMedium}
          variant="contained"
          color="primary"
          className="normal-case text-md"
          onClick={handleCheckout}
          disabled={confirmButtonDisabled}
        >
          {isLoading ? <CircularProgress color="inherit" size={22} /> : 'Confirm'}
        </Button>
      </div>

      {totalAmountError && (
        <div>
          <p className="text-red-500 text-sm">**Total amount should not be less then $1.00**</p>
        </div>
      )}

      {/* --- MOVED: Hold with Credit Toggle --- */}
      {reservationDepositAmount > 0 && <HoldCoveredCredit />}
      {/* ------------------------------------- */}

      {/* large screen */}
      {!!depositMessage && (
        <div className={`hidden lg:inline xl:inline mt-2`}>
          <p className="text-xs text-justify font-bold text-red-400 tracking-tight">{depositMessage}</p>
        </div>
      )}

      <div className={`${isIPadPro ? '' : 'lg:mb-6'} mt-4`}>
        {Object.values(verificationFlags).some((value) => value === false) && (
          <span className="helping_text tracking-tight leading-none">
            {`Please confirm that you have completed all verifications to be ready for driving. Generally, it takes 24 hours for verification from the admin. If it's taking longer, please `}
            <Link
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_DOMAIN}/support/support-center/general`}
              className="text-primary inline-block no-underline font-bold italic"
            >
              contact support
            </Link>
            {` for further assistance.`}
          </span>
        )}
      </div>
    </>
  );
};

export default CheckoutLg;
