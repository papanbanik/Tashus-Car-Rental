import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { VerificationStatusProps } from '@/types/user-verification/verificationListingSteps';
import { getTextColorClass } from '@/utils/Functions/verification/verificationStyleFn';
import { BsInfoCircle } from 'react-icons/bs';
import CommonTextIcon from '../CommonTextIcon';

const CommonVerificationStatus = ({ status, text }: VerificationStatusProps) => {
  const textColorClass = getTextColorClass(status);
  const isIPadPro = useIPadProQuery();
  return (
    <div className="border border-accent border-solid mt-10 p-4 rounded-lg">
      <div className={`flex flex-col ${isIPadPro ? 'flex-col' : 'lg:flex-row lg:justify-between'}`}>
        <span className="text-sm font-bold">
          Verification Status : <span className={`text-${textColorClass} capitalize`}>{status ?? 'incomplete'}</span>
        </span>
        <span>
          <CommonTextIcon
            text={text}
            wrapAround={true}
            textClassName="text-xs sm:text-sm text-gray-600 inline-block"
            startIcon={<BsInfoCircle className="text-xs sm:text-sm text-error" />}
          />
          {/* <Info height={10} width={14} className="text-red-700" /> {text} */}
        </span>
      </div>
    </div>
  );
};

export default CommonVerificationStatus;
