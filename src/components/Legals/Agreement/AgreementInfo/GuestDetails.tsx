'use client';
import { useUserCredContext } from '@/context/UserCredProvider';
import { AgreementInfoProps } from '@/types/legals/agreementTypes';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';

const GuestDetails = ({ reservationDetails, count }: AgreementInfoProps) => {
  const { userCred } = useUserCredContext();
  const { guest } = reservationDetails ?? {};
  const { guestName, guestContactNumber = '', guestLicenseInfo } = guest ?? {};
  const { licenseName, licenseNumber, country, state, expiryDate } = guestLicenseInfo ?? {};
  return (
    <div className="mb-6">
      <div className="font-bold text-xl block item-start md:flex md:items-center">
        <div className="font-bold mr-1 inline-block text-center ">{count}.</div> {`Guest's Details`} :
        <span className="text-justify text-base font-normal ps-0 md:ps-2">
          <span className="font-semibold">{`“Guest”`}</span> is defined as the person who borrows a vehicle from{' '}
          <span className="font-semibold">Tashus Pty Ltd.</span>
        </span>
      </div>
      <div className="pl-4">
        <div className="flex flex-col">
          <div className="font-semibold mb-1">
            {`Guest's`} Name : <span className="font-normal">{guestName}</span>{' '}
          </div>
          <div className="font-semibold mb-1">
            {`Guest's`} Email : <span className="font-normal">{userCred?.email ?? ''}</span>{' '}
          </div>
          <div className="font-semibold mb-1">
            {`Guest's`} Phone : <span className="font-normal">{guestContactNumber === '' ? `N/A` : guestContactNumber}</span>
          </div>
          {guestLicenseInfo && (
            <div className=" flex flex-col mt-2">
              <span className="font-bold mb-1 underline">{`Guest's`} License Info :</span>
              <div>
                <div className="font-semibold mb-1">
                  Name on License : <span className="font-normal">{licenseName ?? 'N/A'}</span>
                </div>
                <div className="font-semibold mb-1">
                  License Number : <span className="font-normal">{licenseNumber ?? 'N/A'}</span>
                </div>
                <div className="font-semibold mb-1">
                  Country : <span className="font-normal">{country ?? 'N/A'}</span>
                </div>
                <div className="font-semibold mb-1">
                  State : <span className="font-normal">{state ?? 'N/A'}</span>
                </div>
                <div className="font-semibold mb-1">
                  Expiry Date : <span className="font-normal">{formatFullDateTime(expiryDate ?? '')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestDetails;
