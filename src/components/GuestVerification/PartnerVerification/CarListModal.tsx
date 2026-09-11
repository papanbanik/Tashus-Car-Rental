import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
interface CarListModalProps {
  handleAddNewListing: () => void;
}
const CarListModal = ({ handleAddNewListing }: CarListModalProps) => {
  const router = useRouter();
  const { guestVerificationFlags, verificationStatusFlags } = useSearchContext();
  const { closeModal } = useModalContext();
  const handleVerify = () => {
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/on-boarding/verification`);
    closeModal();
  };
  const handleListing = () => {
    handleAddNewListing();
    // router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/car-listing`);
    closeModal();
  };
  return (
    <div>
      <Typography align="center" className="font-semibold md:text-2xl text-xl">
        Partner Verification
      </Typography>
      <Typography variant="subtitle2" align="center" className="helping_text">
        {`To list a car, complete the Tashus verification process. This ensures a secure and reliable experience for both partners and guests.`}
      </Typography>
      <div className="flex justify-center mt-8 gap-6">
        <Button variant="contained" color="primary" className="normal-case text-md" onClick={handleVerify}>
          Verify your ID
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="normal-case text-md"
          onClick={handleListing}
          disabled={Object.values(verificationStatusFlags).some((value) => value === false)}
        >
          List a Vehicle
        </Button>
      </div>
    </div>
  );
};

export default CarListModal;
