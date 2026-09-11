'use client';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

const DisplayEventModal = ({ isOpen, onClose, event }: EventModalProps) => {
  if (!isOpen || !event) {
    return null;
  }
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle className="font-bold">Event Details</DialogTitle>
      <DialogContent className="grid grid-cols-1">
        <Typography className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <span>
            Start: <span className="font-bold">{formatFullDateTimeUtc(event.start_time)}</span>
          </span>
          <span>
            End: <span className="font-bold">{formatFullDateTimeUtc(event.end_time)}</span>
          </span>
        </Typography>
        {event?.dailyPrice && event?.hourlyPrice && (
          <Typography className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <span>
              Daily: <span className="font-bold">${event?.dailyPrice}/day</span>
            </span>
            <span>
              Hourly: <span className="font-bold">${event?.hourlyPrice}/hr</span>
            </span>
          </Typography>
        )}
        {event?.title !== '' && (
          <span>
            Title: <span className="font-bold">{event.title}</span>
          </span>
        )}
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

export default DisplayEventModal;
