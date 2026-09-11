import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { CreditCheckoutProps } from '@/types/checkout/checkoutTypes';
import { calculateWithPrecision, parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { Alert, Button, Divider } from '@mui/material';
import Image from 'next/image';
import { useEffect } from 'react';
import { IoIosHelpCircleOutline } from 'react-icons/io';
import VoucherCreditBilling from './VoucherCreditBilling';
import VoucherCreditInput from './VoucherCreditInput';

const CreditCheckout = ({
  applyBtnShow,
  setApplyBtnShow,
  payable,
  setCreditInputString,
  setCreditVoucherToggle,
  creditInputString,
}: CreditCheckoutProps) => {
  const {
    totalPrice,
    reservationInfo,
    appliedCreditInfo,
    setAppliedCreditInfo,
    reservationDepositAmount = 0,
    creditInput,
    setCreditInput,
    holdWithCredit,
  } = useSearchContext();
  const { userProfileInfo } = useUserCredContext();
  const availableCredit = !!userProfileInfo?.totalAvailableCredit ? Number((userProfileInfo?.totalAvailableCredit).toFixed(2)) : 0;
  const { isCreditValid = false, responseMessage = '', deductedCreditAmount = 0 } = appliedCreditInfo ?? {};
  const applyCredit = () => {
    const invalidCreditInfo = { deductedCreditAmount: 0, totalAfterCredit: 0, isCreditValid: false };

    // Calculate total required if "Hold" is toggled
    const requiredAmount = holdWithCredit ? calculateWithPrecision('add', [creditInput, reservationDepositAmount]) : creditInput;

    if (!reservationInfo || !userProfileInfo) {
      setAppliedCreditInfo({ ...invalidCreditInfo, responseMessage: 'Try again' });
      return;
    }

    if (!creditInput || creditInput <= 0) {
      setAppliedCreditInfo({ ...invalidCreditInfo, responseMessage: 'Invalid Credit Amount' });
      return;
    }

    // Check if total (Input + Deposit) exceeds available balance
    if (requiredAmount > availableCredit) {
      setAppliedCreditInfo({
        ...invalidCreditInfo,
        responseMessage: holdWithCredit
          ? `Insufficient credit to cover both payment and $${reservationDepositAmount} deposit.`
          : 'Insufficient credit',
      });
      return;
    }

    if (creditInput > totalPrice) {
      setAppliedCreditInfo({ ...invalidCreditInfo, responseMessage: 'Credit Amount exceeds Total Price' });
      return;
    }

    setAppliedCreditInfo({
      deductedCreditAmount: parseFloatWithPrecision(creditInput),
      totalAfterCredit: calculateWithPrecision('subtract', [totalPrice, creditInput]),
      isCreditValid: true,
      responseMessage: holdWithCredit ? 'Credit and Deposit applied' : 'Credit applied successfully',
      isDepositCoveredByCredit: holdWithCredit,
    });
  };

  useEffect(() => {
    if (creditInputString) {
      setCreditInput(Number(creditInputString));
    } else {
      handleRemoveCreditContents();
    }
  }, [creditInputString]);

  const handleCreditToggle = () => {
    handleRemoveCreditContents();
    setCreditInputString('');
    setCreditVoucherToggle('voucher');
  };

  const handleRemoveCreditContents = () => {
    setApplyBtnShow(false);
    setAppliedCreditInfo(null);
    setCreditInput(0);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreditToggle} size="small" className="w-32 h-5 flex justify-end items-start p-0">
          <Image alt="DollarSign" src="/Images/Dollar.png" width={18} height={18} />
          <div className="text-sm ml-1">Use Voucher</div>
        </Button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image alt="moneybill" src="/Images/moneybill.png" width={50} height={40} />
          <p className="font-semibold">Available Credit</p>
          <IoIosHelpCircleOutline className="text-primary text-base" />
        </div>
        <span className="px-2 bg-success rounded-full text-white font-semibold">{`$${availableCredit}`}</span>
      </div>

      <span className="text-sm font-medium">Use credit for Rent</span>
      <VoucherCreditInput
        imageAlt="DollarSign"
        imageSrc="/Images/Dollar.png"
        label="Credit Amount"
        title="Enter Credit:"
        inputId="credit-input"
        inputName="credit-input"
        onChange={(e) => {
          if (!applyBtnShow) setApplyBtnShow(true);
          setCreditInputString(e.target.value);
        }}
        inputType="number"
        inputValue={creditInputString}
      />

      {applyBtnShow && (
        <div className="mt-3">
          {responseMessage && (
            <Alert severity={isCreditValid ? 'success' : 'error'} className="mb-2 py-0">
              {responseMessage}
            </Alert>
          )}
          <div className="flex justify-end">
            <Button onClick={applyCredit} size="small" variant="contained">
              Apply
            </Button>
          </div>
        </div>
      )}

      <Divider className="my-4 bg-black" />

      <VoucherCreditBilling
        payable={payable}
        rentFee={reservationInfo?.totalPrice ?? 0}
        showDeductedAmount={isCreditValid}
        deductedAmount={deductedCreditAmount}
        deductedAmountText="Credit Used"
      />

      {/* Show deposit info if covered by credit */}
      {isCreditValid && holdWithCredit && (
        <div className="flex justify-between text-sm text-success font-medium mt-1">
          <span>Deposit Covered by Credit:</span>
          <span>${reservationDepositAmount}</span>
        </div>
      )}
    </>
  );
};

export default CreditCheckout;
