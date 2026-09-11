import { EDeliveryStage, TDeliveryTracker } from '@/types/reservations/reservationDeliveryTypes';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { useState } from 'react';
import { LuChevronLeft, LuChevronRight, LuClock } from 'react-icons/lu';
import { formatStageDisplay } from './utils/functions/deliveryInfoFn';
import { getStageColor, getStageIcon } from './utils/functions/deliveryInfoStyleFn';
import { tableHeaders } from './utils/lists/deliverylist';

const DeliveryTracking = ({
  trackerData = [],
  itemsPerPage = 5,
  isDelivery,
}: {
  trackerData: TDeliveryTracker[];
  itemsPerPage?: number;
  isDelivery?: boolean;
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(trackerData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = trackerData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col my-2">
        <div className="flex items-center text-gray-600">
          <LuClock className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
          <span className="text-sm md:text-lg  font-bold">{`Delivery Tracker`}</span>
        </div>
        <span className="helping_text">Track the progress of vehicle {isDelivery ? 'delivery' : 'return'}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary text-white">
            <tr>
              {tableHeaders?.map((header: string, index: number) => (
                <th key={index} className="p-2 text-xs font-medium uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-blush' : 'bg-white'} text-center`}>
                <td className="p-2 whitespace-nowrap">
                  <div
                    className={`inline-flex justify-center items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStageColor(
                      item.stage
                    )}`}
                  >
                    {getStageIcon(item.stage)}
                    <span>{item.stage === EDeliveryStage.StartOnWay ? 'On the Way' : formatStageDisplay(item.stage)}</span>
                  </div>
                </td>
                <td className="p-2 whitespace-nowrap text-sm text-gray-900">{formatFullDateTime(item.timestamp)}</td>
                <td className="p-2 text-sm text-gray-600">
                  <div className="max-w-xs mx-auto">{item?.description || '-'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className=" p-2 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-primary">
              Showing{' '}
              <b>
                {startIndex + 1} to {Math.min(endIndex, trackerData.length)}
              </b>{' '}
              of <b>{trackerData.length}</b> entries
            </div>

            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full border-none bg-transparent ${
                  currentPage === 1 ? ' text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-secondary'
                }`}
              >
                <LuChevronLeft className="h-4 w-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getVisiblePages().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`text-sm font-medium rounded-full border border-primary ${
                      currentPage === page ? ' bg-primary text-neutral' : 'bg-transparent text-primary hover:bg-secondary'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full border-none bg-transparent ${
                  currentPage === totalPages ? 'text-gray-400 cursor-not-allowed ' : 'text-primary hover:bg-secondary'
                }`}
              >
                <LuChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;
