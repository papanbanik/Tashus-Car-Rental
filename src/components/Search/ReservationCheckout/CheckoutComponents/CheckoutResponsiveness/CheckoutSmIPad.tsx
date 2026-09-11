import CommonCheckbox from '@/components/Common/CommonCheckbox';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { CheckoutProps } from '@/types/checkout/checkoutTypes';
import { loadText } from '@/utils/Functions/randomCommonFn';
import { getVerificationFlags } from '@/utils/Functions/verification/verificationFn';
import { AppBar, Button, CircularProgress } from '@mui/material';
import Link from 'next/link';
import HoldCoveredCredit from '../../Checkout/HoldCoveredCredit';

const CheckoutSmIPad = ({ payable, isAgreed, setIsAgreed, handleCheckout, isLoading, totalAmountError, confirmButtonDisabled }: CheckoutProps) => {
  const isIPadPro = useIPadProQuery();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { reservationDepositAmount = 0 } = useSearchContext();
  const verificationFlags = getVerificationFlags(userProfileVerificationInfo);
  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 35 }} className="bg-transparent shadow-none">
      <div className="bg-secondary mx-4 rounded-lg px-10 py-4 flex flex-col justify-center items-center">
        <div className="w-full flex justify-center items-center gap-2">
          <p className="text-black font-semibold m-0">Payable: </p>
          <p className="text-black font-semibold m-0">${!Number.isNaN(payable) ? payable?.toFixed(2) : loadText}</p>{' '}
          {/* Also change in voucher total & credit total */}
        </div>
        <div className="w-full">
          {/* <FormGroup className={`flex justify-center items-center ${isIPadPro ? '' : 'lg:mt-6'} text-primary`}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    setIsAgreed(e.target.checked);
                  }}
                  checked={isAgreed}
                  icon={<Unchecked className="text-xl" />}
                  checkedIcon={<Checked className="text-xl" />}
                />
              }
              label={
                <Link href={`${process.env.NEXT_PUBLIC_DOMAIN}/legals/rental-agreement`} color="inherit" target="_blank">
                  Accept Rental Agreements
                </Link>
              }
            />
          </FormGroup> */}
          <CommonCheckbox
            isChecked={isAgreed}
            onChange={(checked) => setIsAgreed(checked)}
            className={`flex justify-center items-center ${isIPadPro ? '' : 'lg:mt-6'} text-primary`}
            label="Accept Rental Agreements"
            labelLink={`${process.env.NEXT_PUBLIC_DOMAIN}/legals/rental-agreement`}
            tooltipText="Please tick the checkbox to agree to the rental agreement."
          />
        </div>
        <div className={`${isIPadPro ? '' : 'lg:w-full lg:justify-center lg:mb-6'} w-full flex justify-end items-center mt-2`}>
          <Button
            fullWidth
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
    </AppBar>
  );
};

export default CheckoutSmIPad;
