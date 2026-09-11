'use client';
import React, { useState, useEffect } from 'react';
import { Snackbar, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';

export default function CookieConsentBanner() {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    const consentTimestamp = localStorage.getItem('consentTimestamp');

    const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();

    if (!cookieConsent || (consentTimestamp && now - parseInt(consentTimestamp) > sixMonthsInMs)) {
      setOpen(true);

      setTimeout(() => {
        setOpen(false);
        localStorage.setItem('cookieConsent', 'true');
        localStorage.setItem('consentTimestamp', now.toString());
      }, 5000);
    }
  }, []);

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <>
      <Snackbar
        open={open}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{
          maxWidth: '300px',
          '& .MuiSnackbarContent-root': {
            padding: '0',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: '4px',
            boxShadow: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            gap: '8px',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleSnackbarClose}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="div" className="font-semibold">
            Cookie Notice
          </Typography>
          <Typography variant="body2">
            Cookies and similar technologies are used on this website to enable key site features, gather analytics, personalize content, and deliver
            targeted advertising. For details, check the link below:
          </Typography>

          <Link href={`/legals/privacy`} className="no-underline" target="_blank">
            <Typography variant="body2">Cookie Policy</Typography>
          </Link>
        </Box>
      </Snackbar>
    </>
  );
}
