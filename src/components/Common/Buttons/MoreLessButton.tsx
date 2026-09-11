import Button from '@mui/material/Button';

interface MoreLessButtonProps {
  isExpanded: boolean;
  toggleExpand: () => void;
}

const MoreLessButton = ({ isExpanded, toggleExpand }: MoreLessButtonProps) => {
  return (
    <Button variant="outlined" color="primary" onClick={toggleExpand} sx={{ mt: 1 }} size="small">
      {isExpanded ? 'Less' : 'More'}
    </Button>
  );
};

export default MoreLessButton;
