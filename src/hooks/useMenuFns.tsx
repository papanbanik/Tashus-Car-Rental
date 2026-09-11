import { useModalContext } from '@/context/ModalProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useRouter } from 'next/navigation';

const useMenuFns = () => {
  const { userCred, setUserCred, setUserType } = useUserCredContext();
  const router = useRouter();

  const handleSignUpMenu = (userType: string) => {
    setUserType(userType);
  };

  return {
    handleSignUpMenu,
  };
};

// export default useMenuFns;
