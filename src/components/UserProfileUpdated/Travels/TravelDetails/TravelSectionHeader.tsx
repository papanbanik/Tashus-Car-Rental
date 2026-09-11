import Typography from '@mui/material/Typography/Typography';

export interface ITravelSectionHeader {
  title: string;
  isCenter?: boolean;
}

const TravelSectionHeader = ({ title, isCenter }: ITravelSectionHeader) => {
  return (
    <Typography className={`font-semibold md:text-2xl text-lg ${isCenter && 'text-center'}`}>
      {title}
      {/* <span className="text-success">_</span> */}
    </Typography>
  );
};

export default TravelSectionHeader;
