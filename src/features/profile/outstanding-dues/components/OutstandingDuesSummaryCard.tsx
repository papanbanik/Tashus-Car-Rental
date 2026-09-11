'use client';

interface Props {
  totalOutstandingDues: number;
  totalReservations: number;
}

const OutstandingDuesSummaryCard = ({ totalOutstandingDues, totalReservations }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="rounded-2xl p-5 bg-gradient-to-br from-[#800080] to-[#b300b3] text-white shadow-lg">
        <p className="text-sm font-medium opacity-80">Total Outstanding Dues</p>
        <p className="text-3xl font-extrabold mt-1">${totalOutstandingDues.toFixed(2)}</p>
      </div>
      <div className="rounded-2xl p-5 bg-white border border-gray-200 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Reservations with Dues</p>
        <p className="text-3xl font-extrabold text-gray-800 mt-1">{totalReservations}</p>
      </div>
    </div>
  );
};

export default OutstandingDuesSummaryCard;
