import { Divider, TableCell, TableRow } from '@mui/material';

const TableDivider = () => {
  return (
    <TableRow>
      <TableCell colSpan={2} className="p-0">
        <Divider className="border border-black" />
      </TableCell>
    </TableRow>
  );
};

export default TableDivider;
