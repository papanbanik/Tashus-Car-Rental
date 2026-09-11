import { IPickupReturnTable } from '@/types/componentTypes';
import { formatTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PiMoonLight } from 'react-icons/pi';
import { TiTick } from 'react-icons/ti';

const PickupReturnTableRow = ({ customAvailabilities }: IPickupReturnTable) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {customAvailabilities?.map((customAvailability, index) => (
              <TableCell
                key={index}
                align="center"
                className="font-bold"
                // sx={{
                //   border: '1px solid black',
                //   padding: '0.5rem',
                //   textAlign: 'center',
                // }}
              >
                {customAvailability?.dayOfWeek?.toUpperCase()}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {customAvailabilities?.map((customAvailability, index) => (
              <TableCell key={index} align="center">
                {customAvailability.availability === 'always' ? (
                  <span className="flex items-center">
                    <TiTick size={25} className="text-success mr-1" />
                    All Day
                  </span>
                ) : customAvailability.availability === 'never' ? (
                  <span className=" text-gray-300 flex items-center">
                    <PiMoonLight size={20} className=" text-gray-300 mr-1" />
                    Unavailable
                  </span>
                ) : customAvailability.customHours.length === 0 ? (
                  <span className=" text-gray-300 flex items-center">
                    <PiMoonLight size={20} className=" text-gray-300 mr-1" />
                    Unavailable
                  </span>
                ) : (
                  // customAvailability.customHours.map((hours, idx) => {
                  //   // console.log(hours);
                  //   return (
                  //     // <div key={idx} className="py-2">
                  //     //   {`${formatToLocalTime(hours?.startTime)}`}
                  //     //   {' - '}
                  //     //   {new Date(hours.endTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  //     // </div>
                  //     <div key={idx} className="py-2">
                  //       {new Date(hours.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  //       {' - '}
                  //       {new Date(hours.endTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  //     </div>
                  //   );
                  // })
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
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PickupReturnTableRow;
