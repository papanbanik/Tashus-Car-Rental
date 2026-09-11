'use client';
import { AgreementInfoProps } from '@/types/legals/agreementTypes';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';

const AdditionalDrivers = ({ reservationDetails, count }: AgreementInfoProps) => {
  return (
    <div className="mb-6">
      <div className="font-bold text-xl">
        <div className="font-bold mr-1 inline-block text-center ">{count}.</div> Additional Drivers :{' '}
      </div>
      <div className="pl-4">
        <div>
          <p className="text-justify">{`Additional driver's are the person who meet the following criteria.`}</p>
          <ol type="i">
            <li>{`Have valid driver’s license.`}</li>
            <li>Authorized to drive in Australia.</li>
            <li>Registered member of Tashus</li>
            <li>Verified by Tashus</li>
            <li>Approved to drive by Tashus.</li>
          </ol>
          <p className="text-justify">
            Additional driver is nominated by Guest before or during the start of reservation. Guest will not be There will be no exception.
          </p>
        </div>
        <div>
          {reservationDetails?.additionalDrivers?.length > 0 ? (
            <>
              {reservationDetails?.additionalDrivers
                // .filter((driver: any) => driver.status === 'approved')
                // .filter((driver: any) => driver.status !== 'declined')
                .map((driver: any, idx: number) => {
                  const diverHtml = (
                    <div className="mb-2">
                      <p className="mb-2 mt-0 mx-0 text-base font-semibold">Additional Driver {idx + 1} Information:</p>

                      <p className="m-0 text-sm">
                        <span className="font-semibold">Full Name:</span> {driver?.fullName}
                      </p>
                      <p className="m-0 text-sm">
                        <span className="font-semibold">Email:</span> {driver?.email}
                      </p>
                      {/* <p className="m-0 text-sm">
                        <span className="font-semibold">Phone:</span> {driver?.phone?.number === '' ? 'N/A' : driver?.phone?.number}
                      </p> */}
                      <p className="m-0 text-sm">
                        <span className="font-semibold">Status:</span> <span className="capitalize">{driver?.status}</span>
                      </p>
                      <p className="m-0 text-sm">
                        <span className="font-semibold">Date & Time:</span> {formatFullDateTimeUtc(driver?.createdAt)}
                      </p>
                    </div>
                  );
                  return diverHtml;
                })}
            </>
          ) : (
            <p className="font-semibold">No Additional Divers added</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalDrivers;
