'use client';

import CommonModal from '@/components/Common/CommonModal';
import { DialogProps } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useUserCredContext } from './UserCredProvider';

type ModalContextType = {
  isModalOpen: boolean;
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
  scroll: DialogProps['scroll'];
};

type ModalProviderProps = {
  children: ReactNode;
};

type ModalContent = {
  title?: string | undefined;
  modalWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  content: ReactNode;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const { setSignUpStep, signUpStep, userType, userCred, setIsLoginModal } = useUserCredContext();
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  useEffect(() => {
    if (isModalOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
      if (modalContent?.title === 'Login or Sign Up') {
        setIsLoginModal(true);
      }
    }
  }, [isModalOpen]);

  const openModal = (content: ModalContent) => {
    setModalContent(content);
    setIsModalOpen(true);
    setScroll('paper');
  };

  const closeModal = () => {
    // console.log(userCred);
    if (signUpStep?.current === 'email-resend') {
      // console.log('close');
      setSignUpStep({ previous: '', current: 'email' });
      // userType === 'partner' && userCred?.loggedIn ? router.push('/car-listing') : router.push('/');
      userType === 'partner' && userCred?.loggedIn ? router.push('/car-listing') : '';
    }
    setModalContent(null);
    setIsModalOpen(false);
    setIsLoginModal(false);
  };

  const contextValue: ModalContextType = {
    isModalOpen,
    openModal,
    closeModal,
    scroll,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modalContent && (
        <CommonModal title={modalContent?.title || ''} maxWidth={modalContent?.modalWidth}>
          {modalContent.content}
        </CommonModal>
      )}
    </ModalContext.Provider>
  );
};
