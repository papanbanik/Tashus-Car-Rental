import { IconButton } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { ControlledFieldProps } from '@/types/componentTypes';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { IoAddCircleOutline, IoTrashSharp } from 'react-icons/io5';
import SingleTimePicker from '@/components/Common/HookFormFields/SingleTimePicker';
import dayjs from 'dayjs';
import { TDate } from '@/types/commonTypes';
import { TimeView } from '@mui/x-date-pickers';
import SingleTimePickerTz from '@/components/Common/HookFormFields/SingleTimePickerTz';
import {
  getMinTimeUtc,
  getValidEndTimeUtc,
  getValidStartTimeUtc,
  isEndTimeSmallUtc,
  startEndValidationUtc,
  validateTimeSlotUtc,
} from '@/utils/Functions/utcCommonFn';

const AvailabilityPicker = ({
  control,
  registerName,
  watch,
  setValue,
  getValues,
  reset,
  allErrors,
  trigger,
  setError,
  clearErrors,
}: ControlledFieldProps) => {
  const { fields, append, prepend, remove, update } = useFieldArray({
    control,
    name: `${registerName}.customHours`,
  });

  const disableFields = watch && watch(`${registerName}.allDay`);

  const handleAllDay = (isChecked: boolean) => {
    if (isChecked && setValue) {
      setValue(`${registerName}.customHours`, [fields[0]]);
      fields.splice(1);
    }
  };

  const handleAddNewSlot = async () => {
    const tempTime: any = fields[fields?.length - 1];
    const tempStart = await getValidStartTimeUtc(tempTime?.endTime);
    const tempEnd = await getValidEndTimeUtc(tempStart, 180);
    append({ startTime: new Date(tempStart), endTime: tempEnd, status: 'free' });
  };

  const handleRemoveSlot = async (index: number) => {
    clearErrors && clearErrors(`${registerName}.customHours}`);
    await remove(index);
    // validates the existing time slots
    trigger && (await trigger(`${registerName}.customHours`));
  };

  const handleTimeChange = async (time: Date | null, endType: boolean, index: number) => {
    // when start time changes
    if (!endType && time && setValue && watch) {
      const isEndSmall = await isEndTimeSmallUtc(time, watch(`${registerName}.customHours.${index}.endTime`));

      if (isEndSmall) {
        const tempEnd = await getValidEndTimeUtc(time, 180);
        // const tempEnd = dayjs(time).add(30, 'minute').toDate();
        // update(index, {
        //   ...fields[index],
        //   startTime: time,
        //   endTime: tempEnd,
        // });
        await setValue(`${registerName}.customHours.${index}.endTime`, tempEnd, { shouldValidate: true });
      } else {
        // console.log(time);
        // update(index, {
        //   ...fields[index],
        //   startTime: time,
        // });
      }

      await setValue(`${registerName}.customHours.${index}.startTime`, time, { shouldValidate: true });
    }

    // when end time changes
    if (endType && time && setValue && watch) {
      update(index, {
        ...fields[index],
        endTime: time,
      });
      // await setValue(`${registerName}.customHours.${index}.endTime`, time, { shouldValidate: true });
    }

    trigger && (await trigger(`${registerName}.customHours`));
    // trigger && (await trigger([`${registerName}.customHours.${index}.startTime`, `${registerName}.customHours.${index}.endTime`]));
    return;
  };

  const validateTime = async (time: Date | null, endType: boolean, index: number) => {
    if (watch) {
      const tempOtherSlots = fields?.map((field: any, ind: number) => ({
        ...field,
        oldIndex: ind,
      }));

      if (fields?.length === 1) {
        // const isStartEndValid = await startEndValidation(
        const isStartEndValid = await startEndValidationUtc(
          tempOtherSlots[0]?.startTime,
          tempOtherSlots[0]?.endTime,
          setError,
          `${registerName}.customHours.${index}`
        );

        const shouldClearError = !!(isStartEndValid && allErrors && allErrors[index] && clearErrors);
        shouldClearError && clearErrors(`${registerName}.customHours.${index}`);
        return true;
      } else if (fields?.length > 1) {
        let otherSlots = tempOtherSlots?.filter((field: any, ind: number) => ind !== index);

        const tempStart = watch(`${registerName}.customHours.${index}.startTime`);
        const tempEnd = watch(`${registerName}.customHours.${index}.endTime`);

        const isValidTimeSlot = await validateTimeSlotUtc(
          tempStart,
          tempEnd,
          otherSlots,
          index,
          `${registerName}.customHours.${index}`,
          setError,
          clearErrors
        );
        // console.log('isValidTimeSlot', isValidTimeSlot);
        return isValidTimeSlot;
      }
    }
  };

  const shouldDisableTime = (value: TDate, view: TimeView) => {
    const hour = dayjs(value).hour();
    const minute = dayjs(value).minute();
    return hour === 23 && minute > 15;
  };

  const fieldData = watch && watch(`${registerName}.customHours`);

  return (
    <>
      {fieldData?.map((field: any, index: number) => {
        return (
          <>
            <div
              key={index}
              className={`${
                index === 0 ? 'md:order-2 order-4 md:col-span-5 col-span-10' : 'order-7 md:col-span-5 col-span-10'
              }  md:col-start-4 pl-2 flex justify-between items-center`}
            >
              {/* <SingleTimePicker */}
              <SingleTimePickerTz
                control={control}
                registerName={`${registerName}.customHours.${index}.startTime`}
                disabled={disableFields}
                setValue={setValue}
                index={index}
                handleTimeChange={handleTimeChange}
                handleValidation={validateTime}
                timeError={allErrors && allErrors[index] ? true : false}
                watch={watch}
                fieldValue={field?.startTime}
                setError={setError}
                shouldDisableTime={shouldDisableTime}
              ></SingleTimePickerTz>
              <div className={`${allErrors && allErrors[index] ? 'text-error' : ''} px-1`}>{` - `}</div>
              {/* <div className={`${allErrors && allErrors[index] ? 'text-error' : ''}`}>{`- ${index}`}</div> */}
              {/* <SingleTimePicker */}
              <SingleTimePickerTz
                control={control}
                registerName={`${registerName}.customHours.${index}.endTime`}
                disabled={disableFields}
                minDate={watch && getMinTimeUtc(watch(`${registerName}.customHours.${index}.startTime`))}
                // minDate={watch && watch(`${registerName}.customHours.${index}.startTime`)}
                endType={true}
                index={index}
                handleTimeChange={handleTimeChange}
                handleValidation={validateTime}
                timeError={allErrors && allErrors[index] ? true : false}
                fieldValue={field?.endTime}
                setError={setError}
              ></SingleTimePickerTz>
            </div>
            {index === 0 ? (
              <>
                <div className="md:order-3 order-2 md:col-span-2 col-span-4 md:justify-start justify-end flex">
                  <CheckBox control={control} registerName={`${registerName}.allDay`} label="All Day" onChange={handleAllDay}></CheckBox>
                </div>
                <div className="flex order-4 justify-end items-center gap-2 md:col-span-1 col-span-2">
                  {/* <div className="flex order-4 justify-end items-center gap-2 md:col-span-2 col-span-4"> */}
                  <IconButton className="" onClick={handleAddNewSlot} disabled={disableFields || allErrors}>
                    <IoAddCircleOutline />
                  </IconButton>
                </div>
                <div className="flex justify-end items-center gap-2 md:order-6 order-3 md:col-span-1 col-span-2">
                  {/* <IconButton className="" size="medium" disabled={disableFields || allErrors}>
                    <MdOutlineContentCopy />
                  </IconButton> */}
                </div>
              </>
            ) : (
              <div className="order-7 md:col-start-9 col-start-11 md:col-span-1 col-span-2 flex md:justify-start justify-end">
                <IconButton className="" onClick={() => handleRemoveSlot(index)}>
                  <IoTrashSharp />
                </IconButton>
              </div>
            )}
            {allErrors && allErrors[index] && (
              <div className="text-error text-xs col-span-5 col-start-4 px-2 order-7">{allErrors[index]?.message as any}</div>
            )}
          </>
        );
      })}
    </>
  );
};

export default AvailabilityPicker;
