import { Amount } from '@/types/componentTypes';
import { Divider } from '@mui/material';

const PaymentDetailsModal = ({ paymentData }: { paymentData: Amount[] }) => {
  return (
    <div className="my-2">
      <Divider className="border border-black my-1" />
      <span className="flex justify-between items-center px-2 bg-primary text-white">
        <span className="text-lg font-bold">Payment Details</span>
      </span>
      <Divider className="border border-black my-1" />
      {paymentData?.map((item: Amount, index: number) => (
        <div key={index} className={`flex justify-between items-center text-xs p-2  ${index % 2 === 0 ? 'bg-[#ececec]' : 'bg-[#fafafa]'}`}>
          <span>{item?.label}</span>
          <span className="font-bold">{item?.amount}</span>
        </div>
      ))}
    </div>
  );
};

export default PaymentDetailsModal;
