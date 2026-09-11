import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, PaperProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

interface DraggableDialogProps {
  buttonText: string;
  dialogTitle: string;
  dialogContent: string;
  subscribeText: string;
  draggable: boolean;
  open: boolean;
  onCancel: () => void;
  onSubscribe: () => void;
  disableOutsideClick?: boolean;
}

const DraggableDialog: React.FC<DraggableDialogProps> = ({
  buttonText,
  dialogTitle,
  dialogContent,
  subscribeText,
  draggable,
  open,
  onCancel,
  onSubscribe,
  disableOutsideClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClickOpen = () => setIsOpen(true);
  const handleClose = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (disableOutsideClick && typeof document !== 'undefined') {
      if (event.target !== document.querySelector('.mui-dialog-backdrop')) {
        return;
      }
    }
    setIsOpen(false);
  };

  const handleCancel = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    handleClose(event);
    onCancel();
  };

  const handleSubscribe = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    handleClose(event);
    onSubscribe();
  };

  const PaperComponent = (props: PaperProps) => {
    if (draggable) {
      return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
          <Paper {...props} />
        </Draggable>
      );
    }
    return <Paper {...props} />;
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        {buttonText}
      </Button> */}
      <Dialog open={isOpen} onClose={handleClose} PaperComponent={PaperComponent}>
        <DialogTitle id="draggable-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubscribe}>{subscribeText}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DraggableDialog;
