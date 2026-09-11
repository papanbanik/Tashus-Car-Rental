import { Skeleton } from '@mui/material';
import { usePathname } from 'next/navigation';

const AdditionalFeeSkeleton = () => {
  const pathName = usePathname();
  return (
    <div className={`w-full ${pathName.includes('payment') ? 'md:w-[500px]' : 'md:w-[841px]'}`}>
      <Skeleton animation="wave" variant="text" className="my-2" />
      <Skeleton animation="wave" variant="rounded" className="h-32 md:h-64" />
    </div>
  );
};

export default AdditionalFeeSkeleton;
