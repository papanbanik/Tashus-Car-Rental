import { IMapFormattedResult } from '@/types/mapLocations';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { MdDeleteOutline } from 'react-icons/md';
function createData(name: string) {
  return { name };
}

interface Props {
  onDelete: (id: any) => void;
  pickupLocations: IMapFormattedResult[];
}

const LocationList: React.FC<Props> = ({ onDelete, pickupLocations }) => {
  const handleDeleteClick = (id: any) => {
    // Implement your delete logic here based on the 'id'
    onDelete(id);
  };
  return (
    <TableContainer component={Paper} className="my-5">
      <Table className="table-auto border-collapse" aria-label="simple table">
        <TableBody>
          {pickupLocations?.map((row, index) => (
            <TableRow key={index} className="border-none">
              <TableCell component="th" scope="row">
                {row.complete_address}
              </TableCell>
              <TableCell align="right">{'-----'}</TableCell>
              <TableCell align="right">
                <MdDeleteOutline className="text-primary cursor-pointer" onClick={() => onDelete(row.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LocationList;
