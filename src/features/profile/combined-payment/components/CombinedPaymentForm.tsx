'use client';
import CommonForm from '@/components/Common/CommonForm';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CombinedPaymentFormProps {
  totalAmount: number;
  isProcessing: boolean;
  error: string | null;
  success: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

// ─── Checkout Form ────────────────────────────────────────────────────────────

const CombinedPaymentForm = ({ totalAmount, isProcessing, error, success, handleSubmit }: CombinedPaymentFormProps) => {
  if (success) {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 font-bold text-lg">✓ Payment Successful!</p>
        <p className="text-sm text-gray-500 mt-1">Your payment has been processed.</p>
      </div>
    );
  }

  return (
    <CommonForm handleFunction={handleSubmit}>
      <div className="space-y-4">
        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Processing…
            </span>
          ) : (
            `Pay $${parseFloatWithPrecision(totalAmount)}`
          )}
        </button>
      </div>
    </CommonForm>
  );
};

export default CombinedPaymentForm;
