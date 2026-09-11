import AdvancedCalendar from '@/components/UserProfileUpdated/UserCalendar/AdvancedCalendar';
import { TashusTitle } from '@/utils/Functions/randomCommonFn';
// import UserCalendar from '@/components/UserProfile/UserCalendar/UserCalendar';

export const metadata = {
  title: `Calendar | ${TashusTitle}`,
  description: '',
};

const UserVehiclesCalendar = () => {
  return (
    <div>
      <AdvancedCalendar />
    </div>
  );
};

export default UserVehiclesCalendar;
