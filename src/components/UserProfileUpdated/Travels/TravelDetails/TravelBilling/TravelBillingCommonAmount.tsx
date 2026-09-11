import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React from 'react';

interface TravelBillingCommonAmount {
  amount: number;
  titleText: string;
}

const TravelBillingCommonAmount = ({ amount, titleText }: TravelBillingCommonAmount) => {
  return (
    <TableRow className="w-full">
      <TableCell align="right" colSpan={2} className="font-bold text-md text-right ">
        {`${amount > 0 ? `${titleText}: $${amount?.toFixed(2)}` : ''}`}
      </TableCell>
    </TableRow>
  );
};

export default TravelBillingCommonAmount;
