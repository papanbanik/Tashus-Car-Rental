import { TVoucherRule } from '@/types/voucher-promotion/promotionTypes';
import { formatRuleText } from '@/utils/Functions/voucher/voucherRulesFn';
import { FaList } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
type TVoucherRuleDisplay = {
  voucherRules: TVoucherRule[];
  discountAmount: number;
  discountType: string;
  voucherAmountUsed?: number;
  carName?: string;
};
const VoucherRulesDisplay = ({ voucherRules = [], discountAmount, discountType, voucherAmountUsed, carName }: TVoucherRuleDisplay) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-orange-50 border-b border-gray-200 flex items-center gap-2">
          <FaList className="text-orange-500" />
          <span className="font-semibold text-gray-700">Voucher Rules</span>
        </div>

        <div className="divide-y divide-gray-100">
          {voucherRules.map((rule, index) => (
            <div key={rule.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div
                className="text-sm text-gray-700 font-mono"
                dangerouslySetInnerHTML={{ __html: formatRuleText(rule, discountAmount, discountType, voucherAmountUsed, carName) }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Add Alert */}
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
        <HiOutlineExclamationCircle className="w-5 h-5 text-yellow-700 mt-0.5" />
        <span className="text-sm text-yellow-800">
          If the voucher amount exceeds the remaining payable price, only the eligible amount will be applied.
        </span>
      </div>
    </div>
  );
};

export default VoucherRulesDisplay;
