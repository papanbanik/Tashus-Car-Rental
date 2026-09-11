'use client';
import CommonViewImageModal from '@/components/Common/CommonViewImageModal';
import { Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FaImage } from 'react-icons/fa';

const FuelHistory = ({ dataCar }: { dataCar?: any }) => {
  //Image View
  const [imageOpen, setImageOpen] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const handleImageClick = (imageUrl: string) => {
    setImageOpen(true);
    setSelectedImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setImageOpen(false);
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [currentLogs, setCurrentLogs] = useState<any[]>([]);
  const fuelGauges = (dataCar?.distance?.fuelGauges || []).sort((a: any, b: any) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());

  const totalItems = fuelGauges.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (fuelGauges.length > 0) {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const updatedLogs = fuelGauges.slice(indexOfFirstItem, indexOfLastItem);
      setCurrentLogs(updatedLogs);
    }
  }, [currentPage, fuelGauges]);

  const handlePageChange = (event: any, newPage: number) => {
    setCurrentPage(newPage);
  };
  // console.log(fuelGauges);
  return (
    <div>
      {fuelGauges.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold">Date</TableCell>
                  <TableCell className="font-bold">Vehicle Range</TableCell>
                  <TableCell className="font-bold">Attachment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentLogs.map((log: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{dayjs(log.createdAt).format('DD/MM/YY | hh:mm A')}</TableCell>
                    <TableCell>{log.vehicleKilometersRange ?? 'Not Added'}</TableCell>
                    <TableCell>
                      <>
                        {log.attachmentOfFuelGauge ? (
                          <>
                            <FaImage
                              className="flex items-center justify-center cursor-pointer"
                              onClick={() => handleImageClick(log?.attachmentOfFuelGauge?.imageInfo?.secure_url || '')}
                            />
                          </>
                        ) : (
                          <span className="flex items-center justify-center">{`-`}</span>
                        )}
                      </>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-center mt-4">
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
          </div>
        </>
      ) : (
        <p className="mt-4 text-gray-600">No service logs available</p>
      )}
      <CommonViewImageModal isOpen={imageOpen} handleClose={handleCloseModal} imageUrl={selectedImageUrl} />
    </div>
  );
};

export default FuelHistory;
