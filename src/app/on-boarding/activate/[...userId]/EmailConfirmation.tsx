import VerExpired from '@/components/Verification/VerExpired';
import VerSuccessful from '@/components/Verification/VerSuccessful';
import Verified from '@/components/Verification/Verified';
import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

interface EmailConfirmationProps {
  message?: string;
  isLoading: boolean;
  isError: boolean;
}

const EmailConfirmation = (props: EmailConfirmationProps): JSX.Element => {
  return (
    <Container
    // sx={{
    //   textAlign: '-webkit-center',
    // }}
    >
      <Box
        className="w-auto bg-transparent border-none"
        // component="div"
        // sx={{
        //   mx: 'auto',
        //   // width: 200,
        //   m: 10,
        //   bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.50'),
        //   color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        //   border: '1px solid',
        //   borderColor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300'),
        //   borderRadius: 2,
        //   textAlign: 'center',
        //   fontSize: '0.875rem',
        //   fontWeight: '700',
        // }}
      >
        <div className="p-3">
          {props.isLoading && (
            <>
              <Skeleton className="mt-20" />
              <Skeleton animation="wave" />
            </>
          )}

          {props.isError && (
            <>
              {/* <div>Invalid token*</div> */}
              <VerExpired />
            </>
          )}

          {!props.isError && !props.isLoading && (
            <>
              {/* <div>{props?.message}</div> */}
              {props.message === 'Email verified successfully' ? <VerSuccessful /> : <Verified />}
            </>
          )}
        </div>
      </Box>
    </Container>
  );
};

export default EmailConfirmation;
