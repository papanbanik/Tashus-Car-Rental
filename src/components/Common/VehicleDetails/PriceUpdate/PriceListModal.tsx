'use client';
import { useSearchContext } from '@/context/SearchProvider';
import { dayjsUtc } from '@/utils/Functions/utcCommonFn';
import { Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';

const PriceListModal = () => {
  // const { reservationPriceList } = useSearchContext();
  // const priceHeading = ['Date', 'Daily Price', 'Hourly Price'];
  // const priceData = reservationPriceList.map((row) => [
  //   <span>{dayjs(row.date).format('DD MMM YYYY (ddd)')}</span>,
  //   <span>
  //     <b>${row.dailyPrice}</b>/day
  //   </span>,
  //   <span>
  //     <b>${row.hourlyPrice}</b>/hr
  //   </span>,
  // ]);
  const { reservationPriceList } = useSearchContext();
  const priceHeading = ['Date', 'Daily Price', 'Hourly Price'];
  // console.log(reservationPriceList);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5;
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };
  const totalPages = Math.ceil(reservationPriceList?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const paginatedData = (reservationPriceList || [])?.slice(startIndex, endIndex).map((row, rowIndex) => [
    <span key={rowIndex}>{dayjsUtc(row.date).format('DD MMM YYYY (ddd)')}</span>,
    <span key={rowIndex}>
      <b>
        {' '}
        {row?.rateDailyChange === 'DI' ? (
          <FaArrowUp className="text-success" />
        ) : row?.rateDailyChange === 'DD' ? (
          <FaArrowDown className="text-error" />
        ) : (
          ''
        )}{' '}
        ${row.dailyPrice}
      </b>
      /day
    </span>,
    <span key={rowIndex}>
      <b>
        {' '}
        {row?.rateHourlyChange === 'HI' ? (
          <FaArrowUp className="text-success" />
        ) : row?.rateHourlyChange === 'HD' ? (
          <FaArrowDown className="text-error" />
        ) : (
          ''
        )}{' '}
        ${row.hourlyPrice}
      </b>
      /hr
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

export default PriceListModal;
