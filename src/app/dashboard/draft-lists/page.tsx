import DraftLists from '@/components/CarListing/DraftLists/DraftLists';
import { TashusTitle } from '@/utils/Functions/randomCommonFn';

export const metadata = {
  title: `Draft Lists | ${TashusTitle}`,
  description: '',
};

const DraftListsPage = () => {
  return <DraftLists></DraftLists>;
};

export default DraftListsPage;
