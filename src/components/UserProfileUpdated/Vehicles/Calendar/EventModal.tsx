'use client';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

const EventModal = ({ isOpen, onClose, event }: EventModalProps) => {
  if (!isOpen || !event) {
    return null;
  }
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle className="font-bold">Event Details</DialogTitle>
      <DialogContent className="grid grid-cols-1">
        <Typography className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <span>
            Start: <span className="font-bold">{formatFullDateTimeUtc(event.start)}</span>
          </span>
          <span>
            {/* End: <span className="font-bold">{formatDate(new Date(dayjs(event.end).toDate().getTime() - 1))}</span> */}
            End: <span className="font-bold">{formatFullDateTimeUtc(event.end)}</span>
          </span>
        </Typography>
        <span>
          Title: <span className="font-bold">{event.title}</span>
        </span>
        {event?.price && (
          <span>
            Amount: <span className="font-bold">{event.price}</span>
          </span>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
