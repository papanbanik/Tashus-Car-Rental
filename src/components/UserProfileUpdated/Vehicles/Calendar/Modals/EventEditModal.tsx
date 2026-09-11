'use client';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useDateUnblock } from '@/hooks/vehicle/useDateUnblock';
import { EventModalProps } from '@/types/car-listing/carCalendarTypes';
import { formatEventDetailsUtc } from '@/utils/Functions/blockDatesValidationFn';
import { MenuProps } from '@/utils/Functions/commonStyleFn';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const EventEditModal = ({ isOpen, onClose, event }: EventModalProps) => {
  const { mutateAsync: unBlockDates, isLoading } = useDateUnblock();
  const { eachCalenderDetails } = useProfileInfoContext();
  const { userId: hostId, vehicleId: listingId } = useParams<{ userId: string; vehicleId: string }>();
  const [selectedStartDates, setSelectedStartDates] = useState<string[]>([]);
  const [filteredStartDates, setFilteredStartDates] = useState<any[]>([]);
  const currentDateConvert = getPickerTimeStringInUtc(dayjs(), true);
  const currentDate = currentDateConvert?.formattedTimeDayObj;
  useEffect(() => {
    if (eachCalenderDetails && event) {
      const filteredDates = eachCalenderDetails
        .filter((eventData: any) => {
          return (
            (!!eventData.title ? eventData?.title === event?.title : formatFullDateTime(eventData?.createdAt) === event?.originalTitle) &&
            !dayjs(eventData.end).isBefore(currentDate)
          );
        })
        .map((eventData: any) => ({
          start: eventData.start,
          end: eventData.end,
          title: eventData.title,
          createdAt: formatFullDateTime(eventData?.createdAt),
          _id: eventData?._id,
        }));
      setFilteredStartDates(filteredDates);
    }
  }, [eachCalenderDetails, event]);

  if (!isOpen || !event) {
    return null;
  }

  const handleUnblockDates = async () => {
    const isoDates = selectedStartDates.map((startDate) => {
      return startDate;
    });

    const unblockedDates = isoDates.map((start) => {
      const selectedEvent = filteredStartDates.find((eventData: any) => eventData.start === start);
      if (selectedEvent) {
        const { _id, end, title } = selectedEvent;
        return { _id, start, end, title };
      }
      return null;
    });

    const filteredUnblockedDates = unblockedDates?.filter(Boolean);

    try {
      await unBlockDates({
        listingId: listingId,
        hostId: hostId,
        unblockedDates: filteredUnblockedDates,
      });
      onClose();
    } catch (error: any) {
      console.log('Unblock Error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle className="flex flex-row justify-between">
        <span className="font-bold">{event.title}</span>
        <span className="font-bold ml-8">{dayjs(event.start).format('DD MMM, YYYY')}</span>
      </DialogTitle>
      <DialogContent className="grid grid-cols-1">
        <div>
          <FormControl fullWidth className="mt-4">
            <InputLabel id="demo-multiple-chip-label">Unblock Dates</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={selectedStartDates}
              onChange={(event) => setSelectedStartDates(event.target.value as string[])}
              input={<OutlinedInput id="select-multiple-chip" label="Unblock Dates" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={formatEventDetailsUtc(value, filteredStartDates.find((event: any) => event.start === value).end)}
                      onDelete={() => setSelectedStartDates((prevSelected) => prevSelected.filter((date: string) => date !== value))}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {filteredStartDates.map((eventData: any, index: number) => {
                const matchingEvent = eachCalenderDetails.find(
                  (event: any) =>
                    event.start === eventData.start &&
                    !dayjs(eventData.end).isBefore(currentDate) &&
                    (!!event.title ? event.title === eventData.title : formatFullDateTime(event.createdAt) === eventData.createdAt)
                );

                return (
                  <MenuItem key={index} value={eventData.start}>
                    {formatEventDetailsUtc(eventData.start, matchingEvent?.end)}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText id="demo-multiple-chip-text" className="italic">
              Select one or more dates to unblock
            </FormHelperText>
          </FormControl>
        </div>
        <div className="flex justify-center items-center mt-6">
          <Button disabled={isLoading || selectedStartDates?.length === 0} onClick={handleUnblockDates} variant="contained" color="primary">
            {isLoading ? 'Unblocking' : 'Unblock'}
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventEditModal;
