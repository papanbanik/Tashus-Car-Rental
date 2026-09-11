'use client';

import { Alert, Snackbar } from '@mui/material';
import { createContext, useState, useContext, FC, ReactNode, Dispatch, SetStateAction } from 'react';
import { TSnackBarContent } from '@/types/commonTypes';

interface TSnackBarProvider {
  snackBarOpen?: boolean;
  setSnackBarOpen?: Dispatch<SetStateAction<boolean>>;
  snackBarContent?: TSnackBarContent;
  setSnackBarContent?: Dispatch<SetStateAction<TSnackBarContent>>;
  openSnackBar: ({ message, variant, severity, horizontal, vertical, hideDuration }: TSnackBarContent) => void;
}

type SnackBarProviderProps = {
  children: ReactNode;
};

const SnackBarContext = createContext<TSnackBarProvider | undefined>(undefined);

export const useSnackBarContext = (): TSnackBarProvider => {
  const context = useContext(SnackBarContext);
  if (!context) {
    throw new Error('useSnackBarContext must be used within a SnackBarProvider');
  }
  return context;
};

export const SnackBarProvider: FC<SnackBarProviderProps> = ({ children }) => {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarContent, setSnackBarContent] = useState<TSnackBarContent>({} as TSnackBarContent);

  const openSnackBar = ({ message, variant, severity, horizontal, vertical, hideDuration }: TSnackBarContent) => {
    setSnackBarOpen(true);
    setSnackBarContent({
      message,
      severity,
      variant: variant || 'filled',
      horizontal: horizontal || 'center',
      vertical: vertical || 'top',
      hideDuration: hideDuration || 6000,
    });
  };

  const contextValue: TSnackBarProvider = {
    openSnackBar,
  };

  return (
    <SnackBarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={snackBarContent?.hideDuration || 6000}
        onClose={() => setSnackBarOpen(false)}
        anchorOrigin={{ vertical: snackBarContent?.vertical || 'top', horizontal: snackBarContent?.horizontal || 'center' }}
      >
        <Alert onClose={() => setSnackBarOpen(false)} variant={snackBarContent?.variant} severity={snackBarContent?.severity}>
          {snackBarContent?.message}
        </Alert>
      </Snackbar>
    </SnackBarContext.Provider>
  );
};
