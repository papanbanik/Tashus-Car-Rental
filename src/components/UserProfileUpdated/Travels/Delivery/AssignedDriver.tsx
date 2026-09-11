import { TAssignedDriver } from '@/types/reservations/reservationDeliveryTypes';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { LuCalendar, LuMail, LuPhone } from 'react-icons/lu';
// Assuming LuFileText is needed for the commented-out Notes section
// import { LuCalendar, LuMail, LuPhone, LuFileText } from 'react-icons/lu';
import ProfileAvatar from '@/components/Common/ProfileAvatar';
import { ECommonText, separateAndCapitalize } from '@/utils/Functions/randomCommonFn';
import { GoVerified } from 'react-icons/go';
import { RxCrossCircled } from 'react-icons/rx';

const AssignedDriver = ({ driver }: { driver: TAssignedDriver }) => {
  const { username, firstName = '', lastName = '', email, isEmailVerified, phoneNumber, profilePicture, assignedAt } = driver || {};
  const driverName = separateAndCapitalize(`${firstName} ${lastName}`);
  const driverEmail = email || ECommonText.UndefinedText;
  const { countryCode, areaCode, number, isVerified } = phoneNumber ?? {};
  // Combine phone number details for display
  const fullPhoneNumber = phoneNumber
    ? {
        countryCode: countryCode,
        areaCode: areaCode,
        number: number,
      }
    : null;
  const driverPhone = fullPhoneNumber
    ? `${fullPhoneNumber.countryCode} ${fullPhoneNumber.areaCode ? `(${fullPhoneNumber.areaCode}) ` : ''}${fullPhoneNumber.number}`
    : ECommonText.UndefinedText;
  return (
    <div>
      {/* Divider */}
      <div className="w-full h-px bg-secondary my-4" />
      {/* Driver Photo and Information*/}
      <div className="flex flex-col md:flex-row justify-center md:justify-normal items-start gap-2">
        {/* Driver Photo and Initials*/}
        {/* <div className="flex-shrink-0">
          {profilePicture ? (
            <Image
              src={profilePicture?.secureUrl}
              alt={username || 'Driver'}
              width={64} // Add width and height for Next/Image optimization
              height={64} // Add width and height for Next/Image optimization
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-semibold">
              {getDriverInitials(driverName)}
            </div>
          )}
        </div> */}
        <ProfileAvatar
          //  src={secureUrl}
          alt="Driver Photo"
          firstName={firstName}
          lastName={lastName}
          className={`object-cover`}
          sx={{ width: 100, height: 100, borderRadius: 2, bgcolor: '#800080', fontSize: 30 }}
        />

        {/* Driver Information*/}
        <div className="flex flex-col">
          <span className="font-semibold text-center md:text-start">{driverName}</span>

          <div className="flex flex-col items-center">
            {/* Email */}
            <div className="w-full grid grid-cols-2 text-gray-600">
              <div>
                <LuMail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{driverEmail}</span>
              </div>
              {email && isEmailVerified !== undefined && (
                <span className="ml-2">
                  {isEmailVerified ? <GoVerified className="text-success w-4 h-4" /> : <RxCrossCircled className="text-error w-4 h-4" />}
                </span>
              )}
            </div>

            {/* <span className="hidden md:inline">{` | `}</span> */}

            {/* Phone */}
            <div className="w-full grid grid-cols-2 text-gray-600">
              <div>
                <LuPhone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{!!driverPhone ? driverPhone : 'Not Added'}</span>
              </div>
              {fullPhoneNumber && isVerified !== undefined && (
                <span className="ml-2">
                  {isVerified ? <GoVerified className="text-success w-4 h-4" /> : <RxCrossCircled className="text-error w-4 h-4" />}
                </span>
              )}
            </div>
          </div>

          {/* Assigned At Date */}
          <div className="flex items-center text-gray-600">
            <LuCalendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Assigned at: {formatFullDateTime(assignedAt)}</span>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="w-full h-px bg-secondary my-4" />
    </div>
  );
};

export default AssignedDriver;
