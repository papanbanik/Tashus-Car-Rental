'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useAllNotifications } from '@/hooks/notifications/useAllNotifications';
import { useReadNotification } from '@/hooks/notifications/useReadNotification';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { Alert, Pagination, Typography, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotificationSkeleton from '../Common/Skeletons/NotificationSkeleton';
import NotificationsCard from './NotificationsCard';
const Notifications = () => {
  const { isLoading } = useAllNotifications();
  const { mutateAsync: readNotification } = useReadNotification();
  const router = useRouter();
  const { notificationList } = useProfileInfoContext();
  const [showUnread, setShowUnread] = useState<boolean>(false);
  const [currentNotifications, setCurrentNotifications] = useState<any[]>([]);
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const isIPadPro = useIPadProQuery();
  //Added Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = isSmallScreen ? 6 : 12;
  //   console.log(data?.data?.data);
  // console.log(notificationList);
  const notifications = notificationList || [];

  //Unread Filter
  // const filteredNotifications = showUnread ? notifications.filter((notification: any) => !notification.isRead) : notifications;
  //const filteredNotifications = showUnread ? notifications.filter((notification: any) => !notification.isRead) : [...notifications];
  // Unread Filter and Sort by createdAt
  // const filteredNotifications = showUnread
  //   ? [...notifications].filter((notification: any) => !notification.isRead).sort((a: any, b: any) => dayjs(b.createdAt).diff(dayjs(a.createdAt)))
  //   : [...notifications].sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));
  // Calculate the index of the first and last items to display on the current page
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    if (notificationList.length > 0) {
      const filteredNotifications = showUnread
        ? [...notifications].filter((notification: any) => !notification.isRead).sort((a: any, b: any) => dayjs(b.createdAt).diff(dayjs(a.createdAt)))
        : [...notifications].sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const updatedNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
      setCurrentNotifications(updatedNotifications);
    }
  }, [notificationList, notifications, showUnread]);

  // Handle page change
  const handlePageChange = (event: any, value: number) => {
    setCurrentPage(value);
  };

  //Handle Notification Read
  const handleLinkClick = async (notificationId: string, url: string) => {
    try {
      await readNotification({ notificationId });
      // router.push(url);
      if (typeof window !== undefined) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className={`flex justify-center items-center py-4 ${isIPadPro ? 'p-8' : ''}`}>
      {/* <div className={`flex justify-center items-center py-4 md:py-6 lg-:py-6 xl:p-12`}> */}
      <div className={`w-full md:w-5/6 bg-white rounded-xl shadow-lg shadow-secondary ${isIPadPro ? 'mt-[20px] mb-[300px]' : 'md:my-0'}`}>
        {/* <div className={`w-full md:w-[1180px] bg-white p-6 rounded-xl shadow-lg shadow-secondary my-0 xl:mt-[150px]`}> */}
        {isLoading ? (
          <NotificationSkeleton />
        ) : notifications?.length > 0 ? (
          <>
            <Typography className="font-semibold text-xl md:text-4xl ">Notifications</Typography>
            <div className="grid grid-cols-[auto,1fr]">
              <span>
                <button
                  onClick={() => setShowUnread(false)}
                  className="cursor-pointer flex justify-start flex-wrap text-black bg-transparent border-none hover:bg-secondary hover:text-primary hover:rounded-2xl"
                  //className={`${
                  //   !showUnread ? 'bg-secondary text-primary' : ''
                  //} cursor-pointer flex justify-start flex-wrap text-black bg-transparent border-none hover:bg-secondary hover:text-primary hover:rounded-2xl`}
                >
                  <span className={`${!showUnread ? 'text-success  bg-secondary px-2 rounded-2xl font-bold' : 'text-black'}`}> All</span>
                </button>
              </span>
              <span>
                <button
                  onClick={() => setShowUnread(true)}
                  className="cursor-pointer flex justify-start text-black bg-transparent border-none hover:bg-secondary hover:text-black hover:rounded-2xl"
                  // className={` ${
                  //     showUnread ? 'bg-secondary text-primary' : ''
                  //   }cursor-pointer flex justify-start text-black bg-transparent border-none hover:bg-secondary hover:text-primary hover:rounded-2xl`}
                >
                  <span className={`${showUnread ? 'text-success bg-secondary px-2 rounded-2xl font-bold' : 'text-primary'}`}> Unread</span>
                </button>
              </span>
            </div>
            <div className="my-4">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 my-8`}>
                {currentNotifications.length > 0 ? (
                  <>
                    {currentNotifications.map((notifications: any, index: number) => (
                      <NotificationsCard key={index} notificationDetails={notifications} onLinkClick={handleLinkClick} />
                    ))}
                  </>
                ) : (
                  <Alert severity="info" className="w-full">
                    No Unread Messages. You are all caught up
                  </Alert>
                )}
              </div>
              <div className="flex items-center justify-center my-4">
                <Pagination count={Math.ceil(notifications.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
              </div>
            </div>
          </>
        ) : (
          <div className=" h-96 w-full rounded-lg flex justify-center items-center relative">
            <p className="absolute top-0 text-lg font-semibold text-primary">No Notifications yet</p>
            <Image
              className="mt-6"
              style={{ objectFit: 'contain' }}
              src={'/icons/notifications/no-notification.png'}
              alt="no notification"
              fill={true}
            ></Image>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
