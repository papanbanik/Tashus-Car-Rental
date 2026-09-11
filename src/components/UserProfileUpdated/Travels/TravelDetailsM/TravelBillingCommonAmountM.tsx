import { TableCell, TableRow } from '@mui/material';

const TravelBillingCommonAmountM = ({
  amount,
  titleText,
  textStyle,
  amountTextStyle,
  rowStyle,
}: {
  amount: number | string;
  titleText: string;
  textStyle?: string;
  amountTextStyle?: string;
  rowStyle?: string;
}) => {
  return (
    <TableRow className={rowStyle ?? 'w-full'}>
      <TableCell className={textStyle ?? 'font-bold'}>{`${titleText}`}</TableCell>
      <TableCell align="right" className={amountTextStyle ?? textStyle ?? 'font-bold'}>
        {/* {`${amount > 0 ? `$${amount}` : '$0.00'}`} */}
        {typeof amount === 'number' ? (amount > 0 ? `$${amount.toFixed(2)}` : '$0.00') : amount}
      </TableCell>
    </TableRow>
  );
};

export default TravelBillingCommonAmountM;
