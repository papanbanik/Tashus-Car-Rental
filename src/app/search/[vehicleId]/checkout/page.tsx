import ReservationCheckout from '@/components/Search/ReservationCheckout/ReservationCheckout';
import { TashusTitle } from '@/utils/Functions/randomCommonFn';

export const metadata = {
  title: `Checkout | ${TashusTitle}`,
  description: '',
};

const VehicleCheckoutRoute = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-full 2xl:w-[1480px] flex justify-center items-center">
        <ReservationCheckout></ReservationCheckout>
      </div>
    </div>
  );
};

export default VehicleCheckoutRoute;
