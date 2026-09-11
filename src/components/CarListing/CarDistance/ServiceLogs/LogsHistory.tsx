'use client';
import CommonViewImageModal from '@/components/Common/CommonViewImageModal';
import { Chip, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FaImage } from 'react-icons/fa';

const LogsHistory = ({ dataCar }: { dataCar?: any }) => {
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
  const serviceLogs = (dataCar?.carServiceLog?.serviceLogs || []).sort(
    (a: any, b: any) => dayjs(b.serviceDate).valueOf() - dayjs(a.serviceDate).valueOf()
  );
  // const serviceLogs = (dataCar?.carServiceLog?.serviceLogs || []).sort((a: any, b: any) => b.index - a.index);
  const totalItems = serviceLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (serviceLogs.length > 0) {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const updatedLogs = serviceLogs.slice(indexOfFirstItem, indexOfLastItem);
      setCurrentLogs(updatedLogs);
    }
  }, [currentPage, serviceLogs]);

  const handlePageChange = (event: any, newPage: number) => {
    setCurrentPage(newPage);
  };
  // console.log(serviceLogs);
  return (
    <div>
      {serviceLogs.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold">Service Date</TableCell>
                  <TableCell className="font-bold">Service Odometer</TableCell>
                  <TableCell className="font-bold">Next Service Date</TableCell>
                  <TableCell className="font-bold">Next Service Odometer</TableCell>
                  <TableCell className="font-bold">Status</TableCell>
                  <TableCell className="font-bold">View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentLogs.map((log: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{dayjs(log.serviceDate).format('DD/MM/YY')}</TableCell>
                    <TableCell>{log.odometer}</TableCell>
                    <TableCell>{dayjs(log.nextServiceDate).format('DD/MM/YY')}</TableCell>
                    <TableCell>{log.nextServiceDueOdometer}</TableCell>
                    <TableCell className="capitalize">
                      <Chip
                        label={`${log.status}`}
                        className={
                          log.status === 'approved'
                            ? 'bg-green-100 text-success'
                            : log.status === 'pending'
                            ? 'bg-yellow-100 text-warning'
                            : log.status === 'declined'
                            ? 'bg-red-100 text-error'
                            : 'text-info'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <>
                        {log.documentInfo ? (
                          <>
                            {/* <FaImage className="flex items-center justify-center cursor-pointer" onClick={() => setImageOpen(true)} /> */}
                            <FaImage
                              className="flex items-center justify-center cursor-pointer"
                              onClick={() => handleImageClick(log?.documentInfo?.info?.secure_url || '')}
                            />
                            {/* <CommonViewImageModal
                              isOpen={imageOpen}
                              handleClose={() => setImageOpen(false)}
                              imageUrl={log?.documentInfo?.info?.secure_url || ''}
                            /> */}
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

export default LogsHistory;
