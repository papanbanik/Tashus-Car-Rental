import {
  restrictBothAlert,
  restrictGuestAlert,
  restrictPartnerAlert,
  suspendBothAlert,
  suspendGuestAlert,
  suspendPartnerAlert,
} from '@/utils/Functions/accountStatusCommonFn';
import { Alert } from '@mui/material';

interface CommonAccStatusAlertProps {
  isRestrict?: boolean;
  isSuspend?: boolean;
  isPartner?: boolean;
  isGuest?: boolean;
}

const CommonAccStatusAlert = ({ isRestrict, isSuspend, isPartner, isGuest }: CommonAccStatusAlertProps) => {
  let severity: 'info' | 'warning' | 'error' = 'info';
  let message = '';

  if (isRestrict) {
    severity = 'error';
    message = isPartner && isGuest ? `${restrictBothAlert}` : isPartner ? `${restrictPartnerAlert}` : isGuest ? `${restrictGuestAlert}` : '';
  } else if (isSuspend) {
    severity = 'warning';
    message = isPartner && isGuest ? `${suspendBothAlert}` : isPartner ? `${suspendPartnerAlert}` : isGuest ? `${suspendGuestAlert}` : '';
  }

  return (
    <>
      {message && (
        <Alert severity={severity} className="my-2">
          {message}
        </Alert>
      )}
    </>
  );
};

export default CommonAccStatusAlert;
