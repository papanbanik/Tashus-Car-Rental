import CommonTextIcon from '@/components/Common/CommonTextIcon';
import { CarMaxTripDuration, CarMinTripDuration } from '@/types/car-listing/carAvailabilityTypes';
import { getSingularPluralNoun } from '@/utils/Functions/randomCommonFn';
import { IoMdTime } from 'react-icons/io';

interface CarRequirementProps {
  noticeHoursRequired?: number;
  minTripDuration?: CarMinTripDuration;
  maxTripDuration?: CarMaxTripDuration;
}

const CarRequirement = ({ noticeHoursRequired, minTripDuration, maxTripDuration }: CarRequirementProps) => {
  return (
    <div className="lg:flex lg:gap-2 mb-2">
      {noticeHoursRequired && (
        <CommonTextIcon
          className="md:text-md text-sm"
          text={`${noticeHoursRequired} ${getSingularPluralNoun('hour', noticeHoursRequired)} notice required`}
          startIcon={<IoMdTime className="mr-2 text-primary" />}
        />
      )}

      {!minTripDuration?.noMinimum && (
        <CommonTextIcon
          className="md:text-md text-sm"
          text={`${minTripDuration?.shortestDuration} ${
            minTripDuration?.unit === 'hours'
              ? minTripDuration?.shortestDuration > 1
                ? 'hours'
                : 'hour'
              : minTripDuration?.unit === 'days'
              ? minTripDuration?.shortestDuration > 1
                ? 'days'
                : 'day'
              : minTripDuration?.unit === 'weeks'
              ? minTripDuration?.shortestDuration > 1
                ? 'weeks'
                : 'week'
              : ''
          } minimum duration`}
          startIcon={<IoMdTime className="mr-2 text-primary" />}
        />
      )}

      {!maxTripDuration?.noMaximum && (
        <CommonTextIcon
          className="md:text-md text-sm"
          text={`${maxTripDuration?.longestDuration} ${
            maxTripDuration?.unit === 'days'
              ? maxTripDuration?.longestDuration > 1
                ? 'days'
                : 'day'
              : maxTripDuration?.unit === 'weeks'
              ? maxTripDuration?.longestDuration > 1
                ? 'weeks'
                : 'week'
              : ''
          } maximum duration`}
          startIcon={<IoMdTime className="mr-2 text-primary" />}
        />
      )}
    </div>
  );
};

export default CarRequirement;
