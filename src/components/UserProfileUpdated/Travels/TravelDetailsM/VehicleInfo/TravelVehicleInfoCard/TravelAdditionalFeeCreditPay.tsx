import ConfirmationCheck from '@/components/Common/ConfirmationCheck';
import { useModalContext } from '@/context/ModalProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useReservationAdditionalFeesCredit } from '@/hooks/reservation/reservation-additional-fee/useReservationAdditionalFeeAsCredit';
import { useGetReservationInvoiceInfo } from '@/hooks/reservation/reservation-invoice/useGetReservationInvoiceInfo';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { Button, Chip, TextField } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface TravelAdditionalFeeCreditPayProps {
  currentCreditBalance: number;
  additionalFeeDue: number;
}

const TravelAdditionalFeeCreditPay = ({ currentCreditBalance = 0, additionalFeeDue = 0 }: TravelAdditionalFeeCreditPayProps) => {
  const { updatedTravelData } = useTravelContext();
  const { reservationId, revisedId } = updatedTravelData ?? {};
  const { refetch } = useGetReservationInvoiceInfo({ reservationId, revisedId });
  const [value, setValue] = useState<number | undefined>(additionalFeeDue > 0 ? additionalFeeDue : undefined);
  const [error, setError] = useState<string>('');
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const { mutateAsync: payAdditionalFeesAsCredit, isLoading } = useReservationAdditionalFeesCredit();
  const { closeModal } = useModalContext();
  const { travelId } = useParams<{ travelId: string }>();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    setValue(newValue);
    if (newValue === undefined) {
      setError('');
      return;
    }
    if (newValue > currentCreditBalance) {
      setError(`You don’t have enough credit. Please enter an amount up to $${currentCreditBalance.toFixed(2)}.`);
    } else if (newValue > additionalFeeDue) {
      setError(`The amount cannot be more than the additional fee of $${additionalFeeDue.toFixed(2)}.`);
    } else if (newValue <= 0) {
      setError('Please enter an amount greater than 0.');
    } else {
      setError('');
    }
  };

  const handleCreditPayment = async () => {
    try {
      await payAdditionalFeesAsCredit({ reservationId: Number(travelId), paidAmount: value ?? 0 });
      await refetch();
      closeModal();
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="my-2 flex flex-col md:flex-row justify-between gap-1 md:gap-0 items-center">
        <div className="flex justify-between md:justify-normal gap-2 items-center">
          <span className="font-bold">Current Credit Balance:</span>
          <Chip label={`$${parseFloatWithPrecision(currentCreditBalance)}`} color="primary" variant="outlined" />
        </div>
        <div className="flex justify-between md:justify-normal gap-2 items-center">
          <span className="font-bold">Additional Payment Due:</span>
          <Chip label={`$${parseFloatWithPrecision(additionalFeeDue)}`} color="primary" variant="outlined" />
        </div>
      </div>

      <TextField
        label="Additional Fee Amount"
        type="number"
        value={value ?? ''}
        onChange={handleChange}
        error={!!error}
        fullWidth
        helperText={!!error ? error : `Enter an amount up to $${Math.min(currentCreditBalance, additionalFeeDue).toFixed(2)}`}
      />
      {isConfirm ? (
        <ConfirmationCheck
          title={`Are you sure to pay the additional fee as credit?`}
          agreeButtonText="Yes"
          disagreeButtonText="No"
          disableAgreeButton={isLoading}
          agreeButtonAction={handleCreditPayment}
          disagreeButtonAction={() => setIsConfirm(false)}
        />
      ) : (
        <Button variant="contained" color="success" disabled={!!error || (value ?? 0) <= 0} onClick={() => setIsConfirm(true)} className="my-2">
          Save
        </Button>
      )}
    </div>
  );
};

export default TravelAdditionalFeeCreditPay;
