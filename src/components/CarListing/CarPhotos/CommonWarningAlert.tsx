import { Alert, Typography, SxProps, Theme } from '@mui/material';

interface CommonWarningAlertProps {
  isShow: boolean;
  title?: string;
  message?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  variant?: 'filled' | 'outlined' | 'standard';
  sx?: SxProps<Theme>;
}

const CommonWarningAlert = ({ isShow, title, message, severity = 'error', variant = 'outlined', sx = { mb: 3 } }: CommonWarningAlertProps) => {
  if (!isShow) return null;

  return (
    <Alert severity={severity} sx={sx} variant={variant}>
      <Typography variant="body2">
        {title || message || 'You must upload at least one image to continue. Please add a photo before saving.'}
      </Typography>
    </Alert>
  );
};

export default CommonWarningAlert;
