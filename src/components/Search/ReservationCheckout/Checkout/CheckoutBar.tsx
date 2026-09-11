import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import Policies from '@/components/Common/VehicleDetails/Policies';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { Dispatch, SetStateAction } from 'react';
import { IDiscountAdditionalData } from '../ReservationCheckout';
import CheckoutActionUpdated from './CheckoutActionUpdated';

interface CheckoutBarProps {
  discount: number | any;
  setDiscount: Dispatch<SetStateAction<number | any>>;
  totalAmountAfterDiscount: number | any;
  setTotalAmountAfterDiscount: Dispatch<SetStateAction<number | any>>;
  creditVoucherToggle: boolean | any;
  setCreditVoucherToggle: Dispatch<SetStateAction<boolean | any>>;
  discountAdditionalData: IDiscountAdditionalData;
}

const CheckoutBar = ({
  discount,
  setDiscount,
  totalAmountAfterDiscount,
  setTotalAmountAfterDiscount,
  creditVoucherToggle,
  setCreditVoucherToggle,
  discountAdditionalData,
}: CheckoutBarProps) => {
  const { guestAccess } = useProfileInfoContext();
  return (
    <>
      <div className=" bg-white px-4 md:px-10 py-3 md:py-5 rounded-lg mt-10 md:mt-0">
        {isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
        {isGuestSuspended(guestAccess) && <CommonAccStatusAlert isGuest={true} isSuspend={true} />}
        <CheckoutActionUpdated
          discount={discount}
          setDiscount={setDiscount}
          totalAmountAfterDiscount={totalAmountAfterDiscount}
          setTotalAmountAfterDiscount={setTotalAmountAfterDiscount}
          creditVoucherToggle={creditVoucherToggle}
          setCreditVoucherToggle={setCreditVoucherToggle}
          discountAdditionalData={discountAdditionalData}
        />
        <div className="my-2">
          <Policies />
        </div>
      </div>
    </>
  );
};

export default CheckoutBar;
