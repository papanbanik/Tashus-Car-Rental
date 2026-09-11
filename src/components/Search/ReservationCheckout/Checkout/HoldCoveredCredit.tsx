import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { FormControlLabel, Switch } from '@mui/material';

// --- 1. Helper Hook: Calculates if user has enough credit for Rent + Deposit ---
export const useCreditSufficiency = () => {
  const { reservationDepositAmount, appliedCreditInfo } = useSearchContext();
  const { userProfileInfo } = useUserCredContext();
  const { totalAvailableCredit: availableCredit = 0 } = userProfileInfo || {};
  // Amount already applied to rent
  const rentCreditUsed = appliedCreditInfo?.isCreditValid ? appliedCreditInfo?.deductedCreditAmount || 0 : 0;
  // Credit remaining after rent is deducted
  const creditAfterRent = Math.max(0, availableCredit - rentCreditUsed);
  // How much of the deposit can actually be covered by remaining credit
  const holdCreditAmount = parseFloat(Math.min(creditAfterRent, reservationDepositAmount).toFixed(2));
  // Insufficient only when there is zero credit left for the deposit
  const isInsufficientCredit = holdCreditAmount <= 0;
  return {
    isInsufficientCredit,
    availableCredit,
    rentCreditUsed,
    creditAfterRent,
    holdCreditAmount,
    reservationDepositAmount,
  };
};

// --- 2. The Component ---
const HoldCoveredCredit = () => {
  const { holdWithCredit, setHoldWithCredit } = useSearchContext();
  // Use our new hook to get the math
  const {
    isInsufficientCredit,
    availableCredit = 0,
    rentCreditUsed = 0,
    holdCreditAmount = 0,
    reservationDepositAmount = 0,
  } = useCreditSufficiency();
  const depositAmount = parseFloatWithPrecision(reservationDepositAmount);
  const isPartialCoverage = holdCreditAmount > 0 && holdCreditAmount < reservationDepositAmount;
  return (
    <div
      className={`my-2 rounded-lg border w-full p-2 ${
        isInsufficientCredit && holdWithCredit
          ? 'bg-red-50 border-red-200'
          : isPartialCoverage && holdWithCredit
          ? 'bg-yellow-50 border-yellow-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <FormControlLabel
        className="mr-0 w-full justify-between flex-row-reverse"
        control={
          <Switch
            checked={!!holdWithCredit}
            onChange={(e) => setHoldWithCredit(e.target.checked)}
            color={isInsufficientCredit ? 'error' : isPartialCoverage ? 'warning' : 'primary'}
          />
        }
        label={<span className="text-sm font-medium p-2 text-primary">Use credit for Deposit (${depositAmount})</span>}
      />

      {holdWithCredit && (
        <div className="mt-2 px-2">
          <div className="flex justify-between items-center text-xs font-semibold text-primary">
            <span>Available Credit:</span>
            <span className={isInsufficientCredit ? 'text-red-600' : 'text-success'}>${parseFloatWithPrecision(availableCredit)}</span>
          </div>

          {rentCreditUsed > 0 && (
            <div className="flex justify-between items-center text-xs text-gray-500 mt-0.5">
              <span>Used for Rent:</span>
              <span className="text-orange-500">-${parseFloatWithPrecision(rentCreditUsed)}</span>
            </div>
          )}

          {isInsufficientCredit ? (
            <div className="mt-1">
              <p className="text-xs text-red-500 font-medium">Insufficient credit for deposit.</p>
              <p className="text-[10px] text-red-400 mt-0.5">
                No credit remaining after rent (${parseFloatWithPrecision(rentCreditUsed)}) deduction.
              </p>
            </div>
          ) : isPartialCoverage ? (
            <div className="mt-1">
              <p className="text-xs text-yellow-700 font-medium">Partial coverage applied.</p>
              <p className="text-[10px] text-yellow-600 mt-0.5">
                ${parseFloatWithPrecision(holdCreditAmount)} of ${depositAmount} deposit will be covered by credit.
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-1">Your credit will fully cover the ${depositAmount} security deposit.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HoldCoveredCredit;
