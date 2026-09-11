import { useUserCredContext } from '@/context/UserCredProvider';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const ProfileRedirect = ({ title, editStep }: { title: string; editStep: string }) => {
  const { userCred } = useUserCredContext();
  const searchParams = useSearchParams();

  const source = searchParams.get('source');
  const vehicleId = searchParams.get('vehicle');

  // Construct query parameters only if they exist
  const queryParams = new URLSearchParams();
  if (source) queryParams.set('source', source);
  if (vehicleId) queryParams.set('vehicle', vehicleId);

  const editUrl = `/dashboard/${userCred?.userId}/edit/${editStep}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return (
    <div className="flex justify-between items-center">
      <span className="text-md font-semibold my-2">{title}</span>
      <Link href={editUrl} className="text-md font-semibold text-success">
        Edit
      </Link>
    </div>
  );
};

export default ProfileRedirect;
