import { TableCell, TableRow } from '@mui/material';

const CommonTableRow = ({ title, value }: { title: string; value: string }) => {
  return (
    <TableRow>
      <TableCell className="flex items-center">{title}</TableCell>
      <TableCell align="right">{value}</TableCell>
    </TableRow>
  );
};

export default CommonTableRow;
