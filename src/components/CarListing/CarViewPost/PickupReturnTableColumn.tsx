import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { PiMoonLight } from 'react-icons/pi';
import { TiTick } from 'react-icons/ti';
import { IPickupReturnTable } from '@/types/componentTypes';
import { formatTimeUtc } from '@/utils/Functions/utcCommonFn';

const PickupReturnTableColumn = ({ customAvailabilities }: IPickupReturnTable) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" className="font-bold bg-primary text-white">
              Days of week
            </TableCell>
            <TableCell align="center" className="font-bold bg-primary text-white">
              Availability
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customAvailabilities?.map((customAvailability, index) => (
            <TableRow key={index}>
              <TableCell align="left" className="font-bold">
                {customAvailability?.dayOfWeek?.toUpperCase()}
              </TableCell>
              <TableCell align="left">
                {customAvailability.availability === 'always' ? (
                  <span className="flex items-center">
                    <TiTick size={25} className="text-success mr-1" /> All Day
                  </span>
                ) : customAvailability.availability === 'never' ? (
                  <span className="flex items-center text-gray-300 ">
                    <PiMoonLight size={25} className="text-gray-300 mr-1" /> Unavailable
                  </span>
                ) : customAvailability.customHours.length === 0 ? (
                  <span className="flex items-center text-gray-300 ">
                    <PiMoonLight size={25} className="text-gray-300 mr-1" /> Unavailable
                  </span>
                ) : (
                  customAvailability.customHours.map((hours, idx) => {
                    // console.log(hours);
                    return (
                      <div key={idx} className="py-1">
                        {formatTimeUtc(new Date(hours.startTime))}
                        {' - '}
                        {formatTimeUtc(new Date(hours.endTime))}
                      </div>
                    );
                  })
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PickupReturnTableColumn;
