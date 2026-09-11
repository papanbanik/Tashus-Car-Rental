'use client';
import { useModalContext } from '@/context/ModalProvider';
import { Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { IoCloseSharp } from 'react-icons/io5';
interface ProofGuidelinesProps {
  isOpen: boolean;
  handleClose: () => void;
}
const ProofGuidelines = ({ isOpen, handleClose }: ProofGuidelinesProps) => {
  const { closeModal } = useModalContext();
  return (
    <>
      {/* <Button onClick={closeModal} startIcon={<FaArrowLeft />}>
        Back
      </Button> */}
      <Dialog
        fullWidth
        maxWidth={'sm'}
        open={isOpen}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title" className="text-center font-bold relative">
          {'Address Proof Guidelines'}
          <IconButton className="text-error absolute top-3 right-2" onClick={handleClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>
        <DialogContent className="pt-2">
          {/* <Modal className="flex items-center justify-center" open={isOpen} onClose={handleClose} closeAfterTransition>
      <Fade in={isOpen}> */}
          <Paper elevation={2}>
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography>
                      <span className="font-bold">1.Utility Bills:</span>
                      {` Gas, water, electricity, or landline phone bills with the individual's name and address.`}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={
                    <Typography>
                      <span className="font-bold">2. Bank Statements:</span>
                      {` Recent bank statements that show the individual's residential address.`}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={
                    <Typography>
                      <span className="font-bold">3. Government-issued ID Cards:</span>
                      {` Driver's license, National ID, or any other government-issued identification card that includes the residential address.`}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={
                    <Typography>
                      <span className="font-bold">4. Property Tax Receipts:</span>
                      {` Receipts or documents related to the payment of property taxes.`}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={
                    <Typography>
                      <span className="font-bold">5. Rental or Lease Agreements:</span>
                      {` Agreements or contracts for rental or lease of property with the individual's name and address.`}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={
                    <Typography>
                      <span className="font-bold">6. Employment Records:</span>
                      {` Pay stubs or official letters from employers that include the residential address.`}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={
                    <Typography>
                      <span className="font-bold">7. Insurance Documents:</span>
                      {` Health insurance, vehicle insurance, or home insurance documents with the individual's address.`}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
            <Typography variant="body2">
              <span className="font-bold pl-2">N.B:</span> {`Ensure that you have upload a recent utility bill photo in JPG or PNG format`}
            </Typography>
          </Paper>
        </DialogContent>
        {/* </Fade>
      </Modal> */}
      </Dialog>
    </>
  );
};

export default ProofGuidelines;
