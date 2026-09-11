'use client';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useSearchContext } from '@/context/SearchProvider';

interface CommonSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertProps['severity'];
  autoHideDuration?: number;
  onClose?: () => void;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

const CommonSnackBar: React.FC<CommonSnackbarProps> = ({
  open,
  message,
  severity,
  autoHideDuration = 5000,
  onClose,
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'center',
  },
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const { setVerificationAlertMessage, verificationAlertMessage } = useSearchContext();

  useEffect(() => {
    if (open) {
      setIsOpen(true);

      // Automatically hide the Snackbar after autoHideDuration
      const timer = setTimeout(() => {
        setIsOpen(false);
        if (onClose) {
          onClose();
        }
        setVerificationAlertMessage({});
      }, autoHideDuration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [open, autoHideDuration, onClose]);

  const defaultOnClose = () => {
    setIsOpen(false);
    setVerificationAlertMessage({});
  };

  return (
    <Snackbar open={isOpen} onClose={onClose ? onClose : defaultOnClose} anchorOrigin={anchorOrigin}>
      <MuiAlert elevation={6} variant="filled" severity={severity}>
        {/* <MuiAlert elevation={6} variant="filled" severity={severity} onClose={onClose && onClose}> */}
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default CommonSnackBar;
