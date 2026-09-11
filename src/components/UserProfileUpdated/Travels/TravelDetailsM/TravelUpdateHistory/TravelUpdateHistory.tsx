'use client';

import CommonTooltip from '@/components/Common/CommonTooltip';
import PriceListModal from '@/components/Common/VehicleDetails/PriceUpdate/PriceListModal';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { EPaymentStatus } from '@/types/travels/travelEnums';
import { formatFullDateTime, getDurationDayHourMin } from '@/utils/Functions/dateTimeCommonFn';
import { getPaymentStatus, getReservationPriceListUpdated } from '@/utils/Functions/priceListFn';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { travelHistoryTableHeader } from '@/utils/Lists/travelInfoList';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { useState } from 'react';
import { MdHelpOutline } from 'react-icons/md';
import TravelBillingBreakdown from '../BillingDetails/TravelBillingBreakdown';
import { getReservationHistory } from './allHistoryFn';
import UpgradedCoverage from './UpgradeCoverage/UpgradedCoverage';
import VehicleReplacement from './VehicleReplacement/VehicleReplacement';

export interface ReservationHistoryProps {
  reservationDetailsData: any;
}

export default function TravelUpdateHistory({ reservationDetailsData }: ReservationHistoryProps) {
  const { openModal } = useModalContext();
  const { setReservationPriceList } = useSearchContext();
  const { peakIncreasedDates } = useTravelContext();
  //Pagination
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const { reservationInfo, startDate, endDate, paymentStatus, reservedAt, origin, adminLog } = reservationDetailsData ?? {};
  const {
    basePrice,
    revisedReservations,
    peakIncrease,
    depositAmount,
    cancellationInfo,
    paymentMethod,
    additionalPaymentInfo,
    discounts,
    revisedVehicles,
    revisedCoverages,
  } = reservationInfo ?? {};
  const { totalDeliveryFee, deliveryFeeDiscount, totalReturnFee, returnFeeDiscount } = basePrice ?? {};
  const vehicleDeliveryFee = (totalDeliveryFee ?? 0) - (deliveryFeeDiscount ?? 0);
  const vehicleReturnFee = (totalReturnFee ?? 0) - (returnFeeDiscount ?? 0);
  const finalDeliveryCost = parseFloat((vehicleDeliveryFee + vehicleReturnFee).toFixed(2));
  // Define the necessary arguments (using the variables you already have in your component)
  const revisedData = revisedReservations || [];
  const vehiclesData = revisedVehicles || [];
  const coveragesData = revisedCoverages || [];
  //Updated basePrice
  const isInitialPriceShow = vehiclesData.length > 0 && revisedData.length > 0;
  const updatedBasePrice = {
    ...basePrice,
    dailyPrice: isInitialPriceShow ? vehiclesData[0]?.previousBasePrice?.dailyPrice ?? basePrice.dailyPrice : basePrice.dailyPrice,
    hourlyPrice: isInitialPriceShow ? vehiclesData[0]?.previousBasePrice?.hourlyPrice ?? basePrice.hourlyPrice : basePrice.hourlyPrice,
  };
  const reservationBaseData = {
    newStartDate: startDate,
    newEndDate: endDate,
    peakIncrease: peakIncrease,
    basePrice: updatedBasePrice,
    depositAmount,
    cancellationInfo: cancellationInfo,
    paymentMethod,
    paymentStatus,
    additionalPaymentInfo,
    updatedAt: reservedAt,
    discounts: discounts,
    isRevisedTravel: false, // Initial reservation
  };

  const historyData = getReservationHistory(revisedData, vehiclesData, coveragesData, reservationBaseData);

  // You can now use `historyData` to update your component's state, render it, etc.
  const handlePriceBreakdown = (priceBreakdownInfo: any) => {
    const title = priceBreakdownInfo.isReplaceVehicle
      ? 'Vehicle Replacement Details'
      : priceBreakdownInfo.isUpgradedCoverage
      ? 'Upgrade Coverage Details'
      : 'Billing & Payment Details';
    let content = <TravelBillingBreakdown reservationInfo={priceBreakdownInfo} reservationItem={priceBreakdownInfo} isModal={true} />;
    const dynamicContent = priceBreakdownInfo?.isReplaceVehicle ? (
      <VehicleReplacement replacementInfo={priceBreakdownInfo} />
    ) : priceBreakdownInfo?.isUpgradedCoverage ? (
      <UpgradedCoverage upgradedInfo={priceBreakdownInfo} />
    ) : (
      content
    );
    openModal({
      title: title,
      content: dynamicContent,
    });
  };

  const handleShowPrice = async (item: any) => {
    const reservationList = await getReservationPriceListUpdated(
      item?.newStartDate,
      item?.newEndDate,
      item?.basePrice?.dailyPrice ?? 0,
      item?.basePrice?.hourlyPrice ?? 0,
      item?.basePrice?.customPrices ?? [],
      item?.peakIncrease,
      item?.newStartDate,
      item?.newEndDate,
      item?.basePrice?.dailyPrice ?? 0,
      item?.basePrice?.hourlyPrice ?? 0,
      item?.basePrice?.customPrices ?? [],
      peakIncreasedDates
    );
    setReservationPriceList(reservationList);
    openModal({
      title: 'Show Price Details',
      content: <PriceListModal />,
    });
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Slice the historyData based on pagination
  const paginatedHistoryData = historyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <div className="p-0 sm:p-1 w-full">
      <span className="flex flex-col my-2">
        <span className="font-bold text-lg">Travel Update History</span>
        <span className="helping_text">
          {
            'Clicking on an individual cost in the Cost column will display detailed billing information. In the Vehicle Rates, clicking the sign (?) will show a breakdown of individual daily and hourly rates. Additionally, in serial number #R indicates a Revised Travel update, #V represents a Vehicle Replacement , and #C stands for Coverage Upgraded—each displaying both previous data and basic updated info.'
          }
        </span>
      </span>
      <div className="overflow-x-auto">
        {' '}
        {/* Added wrapper for horizontal scrolling */}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ borderBottom: '2px solid black' }} className="bg-primary">
              {travelHistoryTableHeader?.map((header: string, index: number) => (
                <TableCell key={index} align="center" className="text-sm font-bold text-white whitespace-nowrap">
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedHistoryData?.length > 0 &&
              paginatedHistoryData.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
                  className={index % 2 === 0 ? 'bg-[#fef1fe]' : 'bg-[#f6d1f6]'}
                >
                  {/* Serial No */}
                  <TableCell align="center" className="whitespace-nowrap">
                    {item?.serialNo}
                  </TableCell>

                  {/* Start and End */}
                  <TableCell align="center" className="leading-[18px] whitespace-nowrap">
                    {!!item?.newStartDate ? (
                      <div className="flex flex-col">
                        <span>Start: {formatFullDateTimeUtc(item?.newStartDate)}</span>
                        <span>End: {formatFullDateTimeUtc(item?.newEndDate)}</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>

                  {/* Total Price */}
                  <TableCell
                    align="center"
                    className="leading-[18px] text-primary cursor-pointer font-bold whitespace-nowrap"
                    onClick={() => handlePriceBreakdown(item)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {getPaymentStatus(item?.updatedAt, item?.paymentStatus, reservationDetailsData?.reservationStatus) ===
                      EPaymentStatus.Expired ? (
                        <CommonTooltip title="This payment has expired. The 30-minute window to complete payment has passed and the due amount was not collected. This reservation update will not be counted — you must submit a new update request for the change to take effect.">
                          <span
                            role="status"
                            aria-label="Payment expired — this update is not counted. Guest must resubmit."
                            tabIndex={0}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-400 cursor-help focus:outline focus:outline-2 focus:outline-red-500"
                          >
                            <span className="leading-none" aria-hidden="true">
                              ⚠
                            </span>
                            <span className="leading-none">Expired</span>
                          </span>
                        </CommonTooltip>
                      ) : (
                        <span>${item?.basePrice?.totalPrice ? item?.basePrice?.totalPrice + finalDeliveryCost : ''}</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Duration */}
                  <TableCell align="center" className="leading-[18px] whitespace-nowrap">
                    {!!item?.newStartDate ? getDurationDayHourMin(item?.newStartDate, item?.newEndDate) : '-'}
                  </TableCell>

                  {/* Reserved Time */}
                  <TableCell align="center" className="whitespace-nowrap">
                    {!!item?.updatedAt ? formatFullDateTime(item?.updatedAt) : '-'}
                  </TableCell>

                  {/* Vehicle Rates */}
                  <TableCell align="center" className="whitespace-nowrap">
                    <span className="flex justify-center items-center gap-2">
                      {`$${item?.basePrice?.dailyPrice}/day | $${item?.basePrice?.hourlyPrice}/hr`}
                      {!!item?.newStartDate && (
                        <MdHelpOutline size={15} className="text-primary cursor-pointer font-bold" onClick={() => handleShowPrice(item)} />
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* Pagination Added */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={historyData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}
