import { CommonDrawerProps, DrawerAnchor } from '@/types/componentTypes';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { AiOutlineMenu } from 'react-icons/ai';

const CommonDrawer = ({
  children,
  drawerAnchor,
  vehicleNickName,
  drawerWidth,
  drawerButton,
  buttonClasses,
  buttonVariant,
  open,
  onClose,
  onOpen,
}: CommonDrawerProps) => {
  const drawerContent = (anchor: DrawerAnchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : drawerWidth ?? 250 }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      {children}
    </Box>
  );

  return (
    <div>
      <div className="flex items-center">
        <Button onClick={() => onOpen && onOpen()} className={`normal-case ${buttonClasses}`} variant={buttonVariant}>
          {drawerButton ? drawerButton : <AiOutlineMenu size={20} className="text-primary" />}
        </Button>
        <div className="text-xl text-center font-semibold">{vehicleNickName}</div>
      </div>

      <Drawer anchor={drawerAnchor} open={open ?? false} onClose={onClose}>
        {drawerContent(drawerAnchor)}
      </Drawer>
    </div>
  );
};

export default CommonDrawer;
