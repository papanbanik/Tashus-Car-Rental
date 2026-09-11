'use client';
import { useSearchContext } from '@/context/SearchProvider';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { dayjsUtc } from '@/utils/Functions/utcCommonFn';
import { Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';

const IndividualPriceDisplay = () => {
  const { individualPriceList } = useSearchContext();
  const priceHeading = ['Date', 'Price'];
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5;
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };
  const totalPages = Math.ceil(individualPriceList?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const paginatedData = (individualPriceList || [])?.slice(startIndex, endIndex).map((row, rowIndex) => [
    <span key={rowIndex}>{dayjsUtc(row.date).format('DD MMM YYYY (ddd)')}</span>,
    <span key={rowIndex}>
      <b>${parseFloatWithPrecision(row.price)}</b>
    </span>,
  ]);

  return (
    <>
      <TableContainer component={Paper} className="shadow-lg shadow-secondary">
        <Table>
          <TableHead>
            <TableRow className="bg-primary">
              {priceHeading.map((heading, index) => (
                <TableCell key={index} align="center" className="text-white font-bold">
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell align="center" key={cellIndex}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center mt-4">
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
      </div>
    </>
  );
};

export default IndividualPriceDisplay;
