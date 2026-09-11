'use client';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useEffect, useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import LoginPopUpLoginFunctionality from './loginPopUpLoginFunctionality';
import { useModalContext } from '@/context/ModalProvider';
import { usePathname } from 'next/navigation';

const ParentComponent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { isModalOpen, openModal } = useModalContext();
  const { userCred, isLogOut, isLoginModal } = useUserCredContext();
  const pathName = usePathname();
  useEffect(() => {
    const popupShown = sessionStorage.getItem('popupShown');
    if (!isModalOpen && !popupShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem('popupShown', 'true');
      }, 30000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isModalOpen]);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="relative">
      {!userCred?.loggedIn && showPopup && !isLogOut && !isLoginModal && !isModalOpen && pathName !== '/login' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative w-[700px] lg:w-[700px] rounded-lg min-h-[500px] overflow-hidden shadow-md flex lg:flex-row md:bg-white bg-transparent">
            <div className="lg:w-[55%] w-full bg-white shadow-lg p-6 relative z-10 flex justify-center items-center mx-4 md:mx-0">
              <LoginPopUpLoginFunctionality />
              <div
                className="absolute top-5 right-5 md:text-white text-primary text-4xl hover:text-red-600 bg-transparent border-none z-100 md:hidden"
                onClick={closePopup}
              >
                <IoCloseCircle className="shadow-xl bg-transparent" />
              </div>
            </div>

            <div
              className="lg:w-[50%] w-full h-[600px] lg:h-auto relative bg-cover bg-center hidden md:block"
              style={{ backgroundImage: "url('/landingPageNew/places/operahouse.webp')" }}
            ></div>

            <div
              className="absolute top-5 right-5 md:text-white text-primary text-4xl hover:text-red-600 bg-transparent border-none z-100"
              onClick={closePopup}
            >
              <IoCloseCircle className="shadow-xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
