'use client';
import { Avatar, Badge } from '@mui/material';
import DriverRequestIcon from '../../../public/icons/notifications/driver-request.svg';
// import journeyCancelledIcon from '../../../public/icons/notifications/journey-cancel.svg';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import dayjs from 'dayjs';
import Link from 'next/link';
import { AiFillNotification } from 'react-icons/ai';
import { IoAlert } from 'react-icons/io5';
import { TiMessages } from 'react-icons/ti';
import JourneyIcon from '../../../public/icons/notifications/journey.svg';
import PaymentIcon from '../../../public/icons/notifications/payment.svg';
interface NotificationCardProps {
  notificationDetails: any;
  onLinkClick: (notificationId: string, url: string) => void;
}
const NotificationsCard = ({ notificationDetails, onLinkClick }: NotificationCardProps) => {
  const { _id, senderInfo, title, description, createdAt, type, url, isRead, isPlatformNotification } = notificationDetails;

  //For Icon Show
  const getNotificationIcon = (type: string): React.ReactNode | null => {
    switch (type) {
      case 'Booking':
        return <JourneyIcon className="text-xl" />;
      case 'Payment':
        return <PaymentIcon className="text-xl" />;
      case 'DriverRequest':
        return <DriverRequestIcon className="text-xl" />;
      case 'Message':
        return <TiMessages className="bg-success text-white text-xl rounded-full p-1" />;
      case 'Promotion':
        return <AiFillNotification className="bg-primary text-white text-xl rounded-full p-1" />;
      case 'Alert':
        // return <IoAlert className="bg-error text-white rounded-full" />;
        return <IoAlert className="bg-error text-white text-xl rounded-full p-1" />;
      default:
        return null;
    }
  };
  const badgeContent = getNotificationIcon(type);

  //For Time Show
  const formattedDate = () => {
    const now = dayjs();
    const notificationTime = dayjs(createdAt);
    const diffInSeconds = now.diff(notificationTime, 'second');
    const diffInMinutes = now.diff(notificationTime, 'minute');
    const diffInHours = now.diff(notificationTime, 'hour');
    if (diffInSeconds < 60) {
      return `${diffInSeconds} ${diffInSeconds > 1 ? 'seconds' : 'second'} ago`;
    } else if (diffInSeconds < 3600) {
      return `${diffInMinutes} ${diffInMinutes > 1 ? 'minutes' : 'minute'} ago`;
    } else if (diffInSeconds < 86400) {
      return `${diffInHours} ${diffInHours > 1 ? 'hours' : 'hour'} ago`;
    } else {
      return formatFullDateTime(notificationTime);
    }
  };
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onLinkClick(_id, url);
  };
  return (
    <Link onClick={handleLinkClick} target="_blank" href={url} className={`no-underline text-black ${!isRead ? 'bg-secondary rounded-lg ' : ''}`}>
      <div>
        <div className="grid grid-cols-[auto,1fr] gap-2">
          <div>
            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={badgeContent}>
              <Avatar
                src={isPlatformNotification ? '/icons/tashus-logo.png' : senderInfo?.picture?.imageInfo?.secure_url}
                sx={{ width: 56, height: 56 }}
              />
            </Badge>
          </div>
          <div className="grid grid-cols-1">
            <span className="text-sm font-bold">{title}</span>
            <span className="text-sm">{description}</span>
            <span className="text-xs text-gray-500">{formattedDate()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NotificationsCard;
