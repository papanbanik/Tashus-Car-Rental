import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { Box, List, ListItem, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaHistory, FaRegCreditCard, FaTachometerAlt } from 'react-icons/fa';
import { FaCar } from 'react-icons/fa6';
import { IoIosArrowDown, IoIosArrowUp, IoMdPhotos } from 'react-icons/io';
import { MdDirectionsCar, MdOutlineAssignment, MdOutlineLocationOn, MdOutlineNoteAdd, MdOutlineRateReview } from 'react-icons/md';

interface MenuItem {
  name: string;
  icon: JSX.Element;
  value?: string;
  children?: MenuItem[];
  isExpanded?: boolean;
}

interface SidebarMenuProps {
  scrollToBillingDetails: () => void;
  scrollToConditionDetails: () => void;
  scrollToLocationDetails: () => void;
  scrollToPhotoDetails: () => void;
  scrollToReviewDetails: () => void;
  scrollToOdometerDetails: () => void;
  scrollToReservationHistory: () => void;
  scrollToDeliveryInfo: () => void;
  scrollToReservationNotes: () => void;
  setSelectedTab: any;
  selectedTab?: string;
}

const Sidebar = ({
  scrollToBillingDetails,
  scrollToConditionDetails,
  scrollToLocationDetails,
  scrollToPhotoDetails,
  scrollToReviewDetails,
  scrollToOdometerDetails,
  scrollToReservationHistory,
  scrollToDeliveryInfo,
  scrollToReservationNotes,
  setSelectedTab,
  selectedTab,
}: SidebarMenuProps) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSmall = useMediaQuery('(max-width: 1024px)');
  // Read selected tab from URL or set default
  const defaultTab = searchParams.get('tab') || 'travelDetails';
  const [selectedMenu, setSelectedMenu] = useState<string>(defaultTab);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(pathName?.includes('reservations') ? 'Reservation Details' : 'Travel Details');
  const { travelDetails } = useProfileInfoContext();
  const isDeliveryEnabled = travelDetails?.reservationInfo?.isDeliveryEnabled ?? false;
  const menuData: MenuItem[] = [
    {
      name: pathName?.includes('reservations') ? 'Reservation Details' : 'Travel Details',
      icon: <MdDirectionsCar />,
      value: 'travelDetails',
      children: [
        { name: 'Billing Details', icon: <FaRegCreditCard />, value: 'billingDetails' },
        { name: 'Location', icon: <MdOutlineLocationOn />, value: 'location' },
        { name: 'Condition', icon: <MdOutlineAssignment />, value: 'condition' },
        { name: 'Notes', icon: <MdOutlineNoteAdd />, value: 'notes' },
        ...(isDeliveryEnabled ? [{ name: 'Delivery Info', icon: <FaCar />, value: 'deliveryInfo' }] : []),
      ],
    },
    {
      name: 'Photos',
      value: 'photos',
      icon: <IoMdPhotos />,
    },

    {
      name: 'Odometer',
      value: 'odometer',
      icon: <FaTachometerAlt />,
    },
    {
      name: 'Reviews',
      value: 'reviews',
      icon: <MdOutlineRateReview />,
    },
    ...(pathName?.includes('travels')
      ? [
          {
            name: 'Travel Update History',
            value: 'travel-update-history',
            icon: <FaHistory />,
          },
        ]
      : []),
  ];

  const handleMenuClick = (menu: MenuItem) => {
    const value = menu.value || menu.name;
    setSelectedMenu(value);
    setSelectedTab(value);

    const newUrl = `${window.location.pathname}?tab=${value}`;
    router.push(newUrl, { scroll: false });

    if (menu.value === 'condition') {
      scrollToConditionDetails();
    } else if (menu.value === 'location') {
      scrollToLocationDetails();
    } else if (menu.value === 'billingDetails') {
      scrollToBillingDetails();
    } else if (menu.value === 'photos') {
      scrollToPhotoDetails();
    } else if (menu.value === 'reviews') {
      scrollToReviewDetails();
    } else if (menu.value === 'odometer') {
      scrollToOdometerDetails();
    } else if (menu.value === 'travel-update-history') {
      scrollToReservationHistory();
    } else if (menu.value === 'deliveryInfo') {
      scrollToDeliveryInfo();
    } else if (menu.value === 'notes') {
      scrollToReservationNotes();
    }
  };

  useEffect(() => {
    if (!selectedMenu) return;

    if (selectedMenu === 'photos') {
      scrollToPhotoDetails();
    } else if (selectedMenu === 'reviews') {
      scrollToReviewDetails();
    } else if (selectedMenu === 'condition') {
      scrollToConditionDetails();
    } else if (selectedMenu === 'location') {
      scrollToLocationDetails();
    } else if (selectedMenu === 'billingDetails') {
      scrollToBillingDetails();
    } else if (selectedMenu === 'odometer') {
      scrollToOdometerDetails();
    } else if (selectedMenu === 'travel-update-history') {
      scrollToReservationHistory();
    } else if (selectedMenu === 'deliveryInfo') {
      scrollToDeliveryInfo();
    } else if (selectedMenu === 'notes') {
      scrollToReservationNotes();
    }
  }, [selectedMenu]);

  const toggleAccordion = (menuName: string) => {
    setExpandedMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        padding: 2,
        width: '16rem',
        borderRadius: 2,
        boxShadow: 1,
        position: 'sticky',
        height: isDeliveryEnabled ? '470px' : '450px',
      }}
    >
      {menuData.map((menu, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Box
            onClick={() => {
              handleMenuClick(menu);
              menu.children && toggleAccordion(menu.name);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: selectedMenu === (menu.value || menu.name) ? 'purple' : 'transparent',
              color: selectedMenu === (menu.value || menu.name) ? 'white' : 'inherit',
              fontWeight: 'bold',
              cursor: 'pointer',
              padding: '5px',
              fontSize: '14px',
              borderRadius: 1,
            }}
          >
            <ListItemIcon
              sx={{ color: selectedMenu === (menu.value || menu.name) ? 'white' : 'inherit', padding: '0px', minWidth: '0px', marginRight: '6px' }}
            >
              {menu.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {menu.name}
                  {menu.children &&
                    !isSmall &&
                    (expandedMenu === menu.name ? <IoIosArrowUp style={{ marginLeft: '8px' }} /> : <IoIosArrowDown style={{ marginLeft: '8px' }} />)}
                </Box>
              }
              sx={{
                color: selectedMenu === (menu.value || menu.name) ? 'white' : 'inherit',
                fontSize: '14px',
                '& .MuiTypography-root': {
                  fontSize: '14px',
                },
              }}
            />
          </Box>

          {/* Children Section - Accordion */}
          {menu.children && expandedMenu === menu.name && !isSmall && (
            <List
              sx={{
                position: 'relative',
                pl: 3,
                // mt: 2,
                paddingBottom: '0px',
              }}
            >
              {/* Vertical Line */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: '12px',
                  bottom: 0,
                  width: '2px',
                  backgroundColor: '#E5E7EB',
                }}
                className={`${isDeliveryEnabled ? 'h-[200px]' : 'h-[210px] md:h-[158px]'}`}
              />
              {menu.children.map((child, childIndex) => (
                <ListItem
                  key={childIndex}
                  onClick={() => {
                    handleMenuClick(child);
                  }} // Handle child menu click
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    pl: 2,
                    paddingTop: '3px',
                    paddingBottom: '3px',
                    mb: 1,
                    cursor: 'pointer', // Change cursor to pointer
                    backgroundColor: selectedMenu === (child.value || child.name) ? 'purple' : 'transparent',
                    color: selectedMenu === (child.value || child.name) ? 'white' : '#4B5563', // Color change
                    fontSize: '14px',
                    borderRadius: 1,
                  }}
                >
                  {/* Horizontal Line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '-10px',
                      width: '20px',
                      height: '2px',
                      //   backgroundColor: '',
                      backgroundColor: selectedMenu === (child.value || child.name) ? 'purple' : '#E5E7EB',
                    }}
                  />
                  {/* Child Icon with Smaller Size */}
                  <ListItemIcon
                    sx={{
                      color: selectedMenu === (child.value || child.name) ? 'white' : '#6B7280',
                      padding: '0px',
                      minWidth: '20px',
                      fontSize: '14px',
                    }}
                  >
                    {React.cloneElement(child.icon, { fontSize: '14px' })}
                  </ListItemIcon>
                  <ListItemText
                    primary={child.name}
                    sx={{
                      color: selectedMenu === (child.value || child.name) ? 'white' : '#4B5563',
                      fontSize: '14px',
                      '& .MuiTypography-root': {
                        fontSize: '14px',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default Sidebar;
