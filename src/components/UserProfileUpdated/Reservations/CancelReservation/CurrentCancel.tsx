import { useModalContext } from '@/context/ModalProvider';
import { Alert, Button } from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const CurrentCancel = () => {
  // const params = useParams();
  // const reservationId = params['reservation-id'];
  const { reservationId } = useParams<{ reservationId: string }>();
  const { closeModal } = useModalContext();

  return (
    <div className="flex flex-col justify-center items-center">
      <Alert severity="warning" className="font-bold bg-orange-100 text center">
        Canceling a reservation with false information can cost you $200 of Misleading Fees. Please refer to
        <Link target="_blank" href={'https://www.tashus.com/help/article/95'} className="text-primary no-underline">
          {' Tashus Partner Cancellation Policy '}
        </Link>
        for more details.
      </Alert>
      <p className="text-center text-gray-500">To cancel a current reservation, you have to create a support ticket. </p>

      <Button
        href={`/support/support-center/${reservationId}?role=host&from=cancelReservation`}
        variant="contained"
        color="primary"
        className="normal-case"
        onClick={closeModal}
      >
        Create Support Ticket
      </Button>
    </div>
  );
};

export default CurrentCancel;
