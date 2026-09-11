import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { PayoutOptionsType } from '@/types/profileInfoTypes';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { getLastPayoutDate, getNextMonthDateRange, getRefundableRequest, getRefunded } from '@/utils/Functions/transactionCommonFn';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUndoAlt, FaUniversity, FaWallet } from 'react-icons/fa';
import { MdOutlineEditNote } from 'react-icons/md';

const TransactionCards = () => {
  const [payoutInfo, setPayoutInfo] = useState<PayoutOptionsType>({} as PayoutOptionsType);

  const { userProfileInfo, userCred } = useUserCredContext();
  const { role, transactionDetails, transactions } = useProfileInfoContext();
  //Destructuring userProfileInfo
  const { payoutInformation } = userProfileInfo || {};
  //Destructuring transactionDetails
  const { totalCredit = 0, totalPayableAmount = 0, lastPayoutAmount = 0, totalRefundable = 0 } = transactionDetails || {};

  useEffect(() => {
    if (payoutInformation?.bankInfo) {
      setPayoutInfo(payoutInformation?.bankInfo);
    }
  }, [userProfileInfo]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 mb-8 sm:mb-10">
      {/* Direct Deposit Account Card */}
      <div className="glassmorphism rounded-2xl p-4 sm:p-6 lg:p-4 card-hover transition-all duration-300 gradient-bg">
        <div className="flex items-center mb-2 lg:mb-1">
          <div className="icon-circle mr-3">
            <FaUniversity className="text-primary text-base sm:text-lg lg:text-base" />
          </div>
          <h2 className="text-base sm:text-lg lg:text-base font-semibold text-gray-800">Direct Deposit Account</h2>
        </div>
        {payoutInfo?.accountNumber ? (
          <>
            <p className="text-xs sm:text-sm lg:text-xs text-gray-600 mb-1 lg:mb-0.5">You have successfully added your direct deposit account</p>
            <div className="mb-1 lg:mb-0.5">
              <Link href={`/dashboard/${userCred?.userId}/setting/payment-option`} className="inline-block no-underline text-primary hover:underline">
                Edit
                <span className="ml-1 inline-block align-middle">
                  <MdOutlineEditNote className="text-primary text-base lg:text-sm" />
                </span>
              </Link>
            </div>
            <p className="text-sm sm:text-lg lg:text-sm text-gray-800 mb-0.5 lg:mb-0">
              {payoutInfo?.accountName ? payoutInfo?.accountName : '**** *** name'}
            </p>
            <p className="text-sm sm:text-lg lg:text-sm text-gray-800">
              {payoutInfo?.accountNumber ? payoutInfo?.accountNumber : '**** **** **** 1234'}
            </p>
          </>
        ) : (
          <>
            <Link href={`/dashboard/${userCred?.userId}/setting/payment-option`} className="inline-block no-underline">
              <Button
                className="normal-case m-0 text-primary font-bold bg-white hover:bg-gray-100 text-xs lg:text-xs"
                variant="contained"
                size="small"
              >
                Add Account Details
              </Button>
            </Link>
            <p className="text-sm sm:text-lg lg:text-sm text-gray-800 mt-1 lg:mt-0.5 mb-0.5 lg:mb-0">**** *** name</p>
            <p className="text-sm sm:text-lg lg:text-sm text-gray-800">**** **** **** 1234</p>
          </>
        )}
      </div>

      {/* Total Payable to You Card */}
      <div className="glassmorphism rounded-2xl p-4 sm:p-6 lg:p-4 card-hover transition-all duration-300 gradient-bg">
        <div className="flex items-center mb-2 lg:mb-1">
          <div className="icon-circle mr-3">
            <FaWallet className="text-primary text-base sm:text-lg lg:text-base" />
          </div>
          <h2 className="text-base sm:text-lg lg:text-base font-semibold text-gray-800">Total Payable to You</h2>
        </div>
        <p className="text-xl sm:text-3xl lg:text-2xl font-bold text-primary mt-1 lg:mt-0.5">
          AUD ${totalPayableAmount ? parseFloatWithPrecision(totalPayableAmount) : '0.00'}
        </p>
        <p className="text-xs sm:text-sm lg:text-xs text-gray-600 mt-1 lg:mt-0.5">
          Last Paid: <span className="font-medium">AUD ${lastPayoutAmount ? parseFloatWithPrecision(lastPayoutAmount) : '0.00'}</span>
        </p>
      </div>

      {/* Conditional Card Based on Role */}
      {role === 'partner' ? (
        <div className="glassmorphism rounded-2xl p-4 sm:p-6 lg:p-4 card-hover transition-all duration-300 gradient-bg">
          <div className="flex items-center mb-2 lg:mb-1">
            <div className="icon-circle mr-3">
              <FaCalendarAlt className="text-primary text-base sm:text-lg lg:text-base" />
            </div>
            <h2 className="text-base sm:text-lg lg:text-base font-semibold text-gray-800">Next Payout Date</h2>
          </div>
          <p className="text-sm sm:text-lg lg:text-sm text-gray-800 mb-1 lg:mb-0.5">{getNextMonthDateRange()}</p>
          <p className="text-xs sm:text-sm lg:text-xs text-gray-600">
            Last Paid Date: <span className="font-medium">{getLastPayoutDate(transactions, role) ?? '*** **, ****'}</span>
          </p>
        </div>
      ) : (
        <div className="glassmorphism rounded-2xl p-4 sm:p-6 lg:p-4 card-hover transition-all duration-300 gradient-bg">
          <div className="flex items-center mb-2 lg:mb-1">
            <div className="icon-circle mr-3">
              <FaUndoAlt className="text-primary text-base sm:text-lg lg:text-base" />
            </div>
            <h2 className="text-base sm:text-lg lg:text-base font-semibold text-gray-800">Refundable Amount</h2>
          </div>
          <p className="text-xl sm:text-3xl lg:text-2xl font-bold text-primary mt-1 lg:mt-0.5">
            AUD ${totalRefundable ? parseFloatWithPrecision(totalRefundable ?? 0) : '0.00'}
          </p>
          <span className="font-medium bg-primary text-white rounded-full px-2 py-0.5 text-xs">{`Credit Amount: $${parseFloatWithPrecision(
            totalCredit
          )} `}</span>
          <div className="flex space-x-3 mt-2 lg:mt-1">
            <span className="text-xs sm:text-sm lg:text-xs text-gray-600">
              Refund Request:{' '}
              <span className="font-medium bg-primary text-white rounded-full px-2 py-0.5 text-xs">{getRefundableRequest(transactions) || 0}</span>
            </span>
            <span className="text-xs sm:text-sm lg:text-xs text-gray-600">
              Refunded: <span className="font-medium bg-primary text-white rounded-full px-2 py-0.5 text-xs">{getRefunded(transactions) || 0}</span>
            </span>
          </div>
        </div>
      )}

      {/* Inline Styles */}
      <style jsx>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }
        .icon-circle {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 50%;
          padding: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .gradient-bg {
          background: linear-gradient(135deg, rgba(128, 0, 128, 0.1), rgba(255, 255, 255, 0.6));
        }
      `}</style>
    </div>
  );
};

export default TransactionCards;
