'use client';
import React, { useState } from 'react';
import VerifyOTPModal from './VerifyOTPModal';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <h1>TEST</h1>

      <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleOpenModal}>
        Open Verify OTP Modal
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-md w-96">
            <VerifyOTPModal onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
