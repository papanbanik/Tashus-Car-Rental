import CustomDateRangeField from '@/components/Common/DateTimePickers/CustomDateRangeField';
import { TSelectedDates } from '@/components/Common/DateTimePickers/CustomDateTime';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useUserTransactionDetails } from '@/hooks/profile/user-transaction/useUserTransactionDetails';
import { TDate } from '@/types/commonTypes';
import Button from '@mui/material/Button/Button';
import ButtonGroup from '@mui/material/ButtonGroup/ButtonGroup';
import FormControl from '@mui/material/FormControl/FormControl';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface ITransactionFeatures {
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  endDate: Date;
  setEndDate: Dispatch<SetStateAction<Date>>;
}

const TransactionFeatures = ({ startDate, endDate, setStartDate, setEndDate }: ITransactionFeatures) => {
  const { userCred, userProfileInfo } = useUserCredContext();
  const { setRole, role, transactions } = useProfileInfoContext();

  const { mutateAsync } = useUserTransactionDetails();

  const defaultSelectedDates = {
    startDate: dayjs().add(1, 'day').toDate(),
    endDate: dayjs().add(3, 'day').toDate(),
    key: 'selection',
  };
  const [selectedDates, setSelectedDates] = useState<[TSelectedDates]>([defaultSelectedDates]);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  useEffect(() => {
    if (transactions?.length > 0) {
      const tempSelection = { ...selectedDates[0] };
      const tempStartDate = transactions[transactions?.length - 1]?.updatedAt ?? transactions[transactions?.length - 1]?.createdAt;
      const tempEndDate = transactions[0]?.updatedAt ?? transactions[0]?.createdAt;
      setSelectedDates([{ ...tempSelection, startDate: new Date(tempStartDate), endDate: new Date(tempEndDate) }]);
    }
  }, [transactions]);

  useEffect(() => {
    setIsFiltered(false);
  }, [role]);

  // new
  function handleStartDateChange(ranges: any) {
    setSelectedDates([{ ...ranges.selection, key: 'selection' }]);
  }

  const handleStartDateField = (startDate: any) => {};

  const fetchFilteredTransactions = async (startDate: TDate, endDate: TDate) => {
    try {
      let from = dayjs(startDate).startOf('day');
      let to = dayjs(endDate).endOf('day');
      // let from = dayjs(selectedDates[0].startDate).startOf('day');
      // let to = dayjs(selectedDates[0].endDate).endOf('day');

      // console.log(selectedDates[0].startDate, selectedDates[0]?.endDate);
      // console.log(from, to);
      await mutateAsync({ userId: userCred?.userId, role, from: from.toISOString(), to: to.toISOString() });
      setIsFiltered(true);
    } catch (error) {
      console.error('fetchFilteredTransactions error', error);
    }
  };

  const fetchDefaultTransactionsData = async () => {
    try {
      mutateAsync({ userId: userCred?.userId, role });
      setIsFiltered(false);
    } catch (error) {
      console.error('user transaction error', error);
    }
  };

  return (
    <section className="w-full my-6 flex flex-col md:flex-row-reverse justify-between items-center gap-4 md:gap-10">
      <div className="flex">
        {/* <Button variant="outlined">Download CSV</Button> */}
        {userProfileInfo?.isAllowListing && (
          <ButtonGroup variant="outlined" aria-label="outlined primary button group">
            <Button onClick={() => setRole('partner')} className={`${role === 'partner' ? 'bg-success text-white' : ''}`}>
              Partner
            </Button>
            <Button onClick={() => setRole('guest')} className={`${role === 'guest' ? 'bg-success text-white' : ''}`}>
              Guest
            </Button>
          </ButtonGroup>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <FormControl
          // sx={customSxStyles.commonBoxStyles}
          variant="outlined"
          className={`md:w-1/2 w-full bg-white mx-0 relative py-0`}
        >
          <CustomDateRangeField
            handleDateChange={handleStartDateChange}
            selectedDates={selectedDates}
            handleDateField={handleStartDateField}
            format="d MMM yy"
            minDate={new Date('2023-01-01')}
            moveRangeOnFirstSelection={false}
            onDatePickerClose={fetchFilteredTransactions}
          ></CustomDateRangeField>
        </FormControl>
        <div className="flex gap-1">
          {/* <Button size="small" onClick={fetchFilteredTransactions} variant="contained">
            Filter
          </Button> */}
          {isFiltered && (
            <Button size="small" onClick={fetchDefaultTransactionsData} className="text-white" color="error" variant="contained">
              Reset
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TransactionFeatures;
