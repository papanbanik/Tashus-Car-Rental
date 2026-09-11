'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useUserTransactionDetails } from '@/hooks/profile/user-transaction/useUserTransactionDetails';
import { TransactionsState, TUserTransaction } from '@/types/user-profile/transactionsTypes';
import React, { useEffect, useState } from 'react';
import PaginationDataTable from './PaginationDataTable';
import TransactionCards from './TransactionCards';
import TransactionFeatures from './TransactionFeatures';
import TransactionTable from './TransactionTable';

const Earnings = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [pageData, setPageData] = useState<TransactionsState>([]);

  const {
    userCred: { userId },
  } = useUserCredContext() as any;
  const { role, transactions, setTransactionDetails, setTransactions } = useProfileInfoContext();

  const { mutateAsync } = useUserTransactionDetails();

  useEffect(() => {
    if (role && userId) {
      try {
        setTransactionDetails({} as TUserTransaction);
        setTransactions([]);
        mutateAsync({ userId, role });
      } catch (error) {
        console.error('user transaction error', error);
      }
    }
  }, [role, userId]);

  useEffect(() => {
    const startIndex = (page * rowsPerPage) as any;
    const pageData = transactions?.length > 0 && (transactions?.slice(startIndex, startIndex + rowsPerPage) as any);
    setPageData(pageData);
  }, [page, rowsPerPage, transactions]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        {/* <div className="mb-6 sm:mb-8">
          <h3 className="text-center text-3xl sm:text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-[#800080] to-[#b300b3]">
            Transaction History for <span className="text-[#800080]">{role}</span>
            <span className="text-[#800080]">_</span>
          </h3>
        </div> */}

        {/* Transaction Cards */}
        <TransactionCards />

        {/* Transaction Features */}
        <div className="my-6">
          <TransactionFeatures startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
        </div>

        {/* Transaction Table */}
        <section className="my-6">
          <div className="glassmorphism rounded-2xl overflow-hidden">
            <div className="table-container">
              <TransactionTable pageData={pageData} startIndex={page * rowsPerPage} />
            </div>
            {transactions?.length > 0 ? (
              <PaginationDataTable
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                count={transactions?.length}
                setRowsPerPage={setRowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            ) : undefined}
          </div>
        </section>
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .table-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 640px) {
          .table-container table {
            min-width: 800px;
          }
        }
      `}</style>
    </div>
  );
};

export default Earnings;
