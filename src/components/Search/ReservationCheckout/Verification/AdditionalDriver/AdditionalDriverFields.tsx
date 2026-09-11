import CommonTextIcon from '@/components/Common/CommonTextIcon';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useNotifyDrivers } from '@/hooks/car-listing/additional-drivers/useNotifyDrivers';
import { useNotifyTripDriver } from '@/hooks/car-listing/additional-drivers/useNotifyTripDriver';
import { TAdditionalDriverInfo } from '@/types/checkout/guestVerificationTypes';
import { Button, Popover, Typography } from '@mui/material';
import Divider from '@mui/material/Divider/Divider';
import IconButton from '@mui/material/IconButton/IconButton';
import TextField from '@mui/material/TextField/TextField';
import dayjs from 'dayjs';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { FieldErrors, useFormContext } from 'react-hook-form';
import { IoSend, IoTrashSharp } from 'react-icons/io5';
import { MdError, MdInfo, MdVerified } from 'react-icons/md';

export interface IAdditionalDriverFields {
  registerName: string;
  index: number;
  fieldNames: string[];
  addFieldFn: () => void;
  removeFieldFn: (index: number) => void;
  disableAddBtn: boolean;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  dataCar?: any;
}

const AdditionalDriverFields = ({
  registerName,
  index,
  fieldNames,
  addFieldFn,
  removeFieldFn,
  disableAddBtn,
  setData,
  dataCar,
}: IAdditionalDriverFields) => {
  const { register, control, setValue, trigger, watch, formState, setError, reset } = useFormContext();
  const { errors, isValid } = formState;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null); //Popover
  const { mutateAsync: sendDriverEmail, isLoading, isSuccess } = useNotifyDrivers(); //Added to sent email
  const { mutateAsync: sendTravelDriverEmail, isLoading: isTravelLoading } = useNotifyTripDriver(); //Added to sent email Trip
  const { userCred } = useUserCredContext(); //added to get hostId
  const { openSnackBar } = useSnackBarContext(); //added for use Snackbar
  const { additionalDrivers } = useSearchContext(); //Set the additional Drivers
  const { carListingId, vehicleId, travelId } = useParams<{ carListingId: string; vehicleId: string; travelId: string }>();
  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  const errorList = errors[registerName] as FieldErrors | undefined;
  const indexError = errorList && errorList[index];
  const pathName = usePathname();

  const fetchByDotOperator = (object: any, value: any) => {
    if (object) {
      return value.split('.').reduce((acc: any, curr: any) => {
        if (acc && acc[curr] !== undefined) {
          return acc[curr];
        } else {
          return undefined;
        }
      }, object);
    } else {
      return undefined;
    }
  };
  const validateDuplicateEmail = (currentEmail: string, currentIndex: number) => {
    if (userCred && userCred?.email === currentEmail) {
      return 'You cannot send a request to your own email.';
    }
    const hasDuplicate = watch(registerName)
      ?.filter((data: TAdditionalDriverInfo, dataIndex: number) => dataIndex !== currentIndex)
      ?.map((data: TAdditionalDriverInfo) => data?.email)
      ?.find((email: string) => email === currentEmail);
    return !hasDuplicate || 'Duplicate Email';
  };

  // Send Email to Driver
  const handleSendMail = async () => {
    const fullName = watch(`${registerName}.${index}.${fieldNames[0]}`);
    const email = watch(`${registerName}.${index}.${fieldNames[1]}`);
    if (pathName.includes('insurance-policy')) {
      try {
        const response = await sendDriverEmail({
          fullName: fullName,
          email: email,
          carListingId: carListingId || vehicleId || dataCar?.listingId,
          hostId: userCred?.userId,
        });
        openSnackBar({
          message: 'Additional Driver Request Sent Successfully',
          severity: 'success',
          hideDuration: 3000,
        });

        const newDriver = response?.data?.data[0];

        setData?.((prevData: any) => {
          const prevAdditionalDrivers = Array.isArray(prevData?.additionalDrivers) ? prevData?.additionalDrivers : [];
          return {
            ...prevData,
            additionalDrivers: [...prevAdditionalDrivers, newDriver],
          };
        });
        // console.log(dataCar?.additionalDrivers);
      } catch (error: any) {
        console.log(error);
        openSnackBar({
          message: error?.response?.data?.message || error?.message || 'Failed to Sent Request',
          severity: 'error',
        });
      }
    } else if (pathName.includes('travels')) {
      try {
        await sendTravelDriverEmail({
          fullName: fullName,
          email: email,
          reservationId: travelId,
          userId: userCred?.userId,
        });
        openSnackBar({
          message: 'Additional Driver Request Sent Successfully',
          severity: 'success',
          hideDuration: 3000,
        });
      } catch (error: any) {
        console.log(error);
        openSnackBar({
          message: error?.response?.data?.message || error?.message || 'Failed to Sent Request',
          severity: 'error',
        });
      }
    }
  };
  //Remove Travel Driver
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveDriver = () => {
    removeFieldFn(index);
  };

  // console.log(additionalDrivers);

  const disableButtons =
    travelDetails?.isTripStarted || (!travelDetails?.isTripStarted && dayjs().isAfter(dayjs(updatedTravelData?.returnDate), 'minute'));

  //Render Button
  const renderButtons = () => {
    // const email = watch(`${registerName}.${index}.${fieldNames[1]}`);
    // const driverStatus = additionalDrivers.find((driver) => driver.email === email)?.status;
    // const statusTime = additionalDrivers.find((driver) => driver.email === email)?.updatedAt;
    const email = (watch(`${registerName}.${index}.email`) || '').trim().toLowerCase();
    const driver = additionalDrivers.find((d) => (d.email || '').trim().toLowerCase() === email);
    const driverStatus = !!indexError ? undefined : driver?.status;
    const statusTime = driver?.updatedAt;
    switch (driverStatus) {
      case 'approved':
        return (
          <div className="md:col-span-2 col-span-6">
            <CommonTextIcon className="text-success" text="Approved" startIcon={<MdVerified className="text-success mr-2" />} />
            <span className="text-sm text-gray-500">{statusTime ? dayjs(statusTime).format('DD MMM, YYYY') : ''}</span>
          </div>
        );
      case 'sent':
        return (
          <div className="md:col-span-2 col-span-6">
            <CommonTextIcon className="text-info" text="Sent" startIcon={<MdInfo className="text-info mr-2" />} />
            <span className="text-sm text-gray-500">{statusTime ? dayjs(statusTime).format('DD MMM, YYYY') : ''}</span>
          </div>
        );
      case 'declined':
        return (
          <>
            <div className="md:col-span-2 col-span-6">
              <CommonTextIcon className="text-error" text="Declined" startIcon={<MdError className="text-error mr-2" />} />
              <span className="text-sm text-gray-500">{statusTime ? dayjs(statusTime).format('DD MMM, YYYY') : ''}</span>
            </div>
          </>
        );
      default:
        if (pathName.includes('insurance-policy')) {
          return (
            <Button
              className="md:col-span-2 col-span-6"
              disabled={!formState?.isValid || isLoading}
              variant="contained"
              startIcon={<IoSend />}
              onClick={handleSendMail}
            >
              {isLoading ? 'Sending' : 'Send'}
            </Button>
          );
        } else if (pathName.includes('travels')) {
          return (
            <Button
              className="md:col-span-2 col-span-6"
              variant="contained"
              startIcon={<IoSend />}
              disabled={disableButtons || !formState?.isValid || isTravelLoading}
              onClick={handleSendMail}
            >
              {isTravelLoading ? 'Sending' : 'Send'}
            </Button>
          );
        } else {
          return (
            <>
              {/* {additionalDrivers.some((driver: any) => driver.email === email) ? (
                <div className="md:col-span-2 col-span-6">
                  <CommonTextIcon className="flex items-center text-info" text="Saved" startIcon={<MdInfo className="text-info mr-2" />} />
                </div>
              ) : (
                <Button className="md:col-span-2 col-span-6" disabled={!formState?.isValid} variant="contained" onClick={handleAddDriver}>
                  Save
                </Button>
              )} */}
            </>
          );
        }
    }
  };

  const renderDeleteButton = () => {
    const email = watch(`${registerName}.${index}.${fieldNames[1]}`);
    const driverStatus = additionalDrivers.find((driver) => driver.email === email)?.status;
    if (pathName.includes('checkout')) {
      return (
        <IconButton className="md:col-span-1 col-span-2 flex" onClick={handleRemoveDriver}>
          <IoTrashSharp />
        </IconButton>
      );
    } else {
      switch (driverStatus) {
        case 'approved':
          if (pathName.includes('travels')) {
            return (
              <>
                <IconButton
                  className="md:col-span-1 col-span-2 flex"
                  disabled={disableButtons}
                  onClick={travelDetails?.isTripStarted ? handleClick : handleRemoveDriver}
                >
                  <IoTrashSharp />
                </IconButton>
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Typography>{`Once a trip has begun, it is not possible to remove additional drivers.`}</Typography>
                </Popover>
              </>
            );
          } else if (pathName.includes('insurance-policy')) {
            return (
              <>
                <IconButton className="md:col-span-1 col-span-2 flex" onClick={handleRemoveDriver}>
                  <IoTrashSharp />
                </IconButton>
              </>
            );
          }
        case 'sent':
          if (pathName.includes('travels')) {
            return (
              <>
                {/* Added Delete Button */}
                <IconButton
                  className="md:col-span-1 col-span-2 flex"
                  disabled={disableButtons}
                  onClick={travelDetails?.isTripStarted ? handleClick : handleRemoveDriver}
                >
                  <IoTrashSharp />
                </IconButton>
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Typography>{`Once a trip has begun, it is not possible to remove additional drivers.`}</Typography>
                </Popover>
              </>
            );
          } else if (pathName.includes('insurance-policy')) {
            return (
              <>
                {/* Added Delete Button */}
                <IconButton className="md:col-span-1 col-span-2 flex" onClick={handleRemoveDriver}>
                  <IoTrashSharp />
                </IconButton>
              </>
            );
          }
        case 'declined':
          if (pathName.includes('travels')) {
            return (
              <>
                <IconButton
                  className="md:col-span-1 col-span-2 flex"
                  disabled={pathName.includes('travels') && disableButtons}
                  onClick={handleSendMail}
                >
                  <IoSend />
                </IconButton>
                {/* Added Delete Button */}
                <IconButton
                  className="md:col-span-1 col-span-2 flex"
                  disabled={disableButtons}
                  onClick={travelDetails?.isTripStarted ? handleClick : handleRemoveDriver}
                >
                  <IoTrashSharp />
                </IconButton>
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Typography>{`Once a trip has begun, it is not possible to remove additional drivers.`}</Typography>
                </Popover>
              </>
            );
          } else if (pathName.includes('insurance-policy')) {
            return (
              <>
                <IconButton className="md:col-span-1 col-span-2 flex" onClick={handleSendMail}>
                  <IoSend />
                </IconButton>
                {/* Added Delete Button */}
                <IconButton className="md:col-span-1 col-span-2 flex" onClick={handleRemoveDriver}>
                  <IoTrashSharp />
                </IconButton>
              </>
            );
          }
        default:
          if (pathName.includes('travels')) {
            return (
              <IconButton
                className="md:col-span-1 col-span-2 flex"
                disabled={pathName.includes('travels') && disableButtons}
                onClick={() => removeFieldFn(index)}
              >
                <IoTrashSharp />
              </IconButton>
            );
          } else if (pathName.includes('insurance-policy')) {
            return (
              <IconButton className="md:col-span-1 col-span-2 flex" onClick={() => removeFieldFn(index)}>
                <IoTrashSharp />
              </IconButton>
            );
          }
      }
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 mb-2 items-start">
      <TextField
        fullWidth
        className="md:col-span-4 col-span-6"
        size="small"
        value={watch(`${registerName}.${index}.${fieldNames[0]}`)}
        label="Full Name"
        disabled={
          !!additionalDrivers.find((driver) => driver.email === watch(`${registerName}.${index}.${fieldNames[1]}`))?.status ||
          (pathName.includes('travels') && disableButtons)
        }
        // sx={{
        //   '& fieldset.MuiOutlinedInput-notchedOutline': {
        //     borderColor: `${watch('drivingLicenseInfo.licenseName') ? '' : '#800080'}`,
        //   },
        // }}
        // InputLabelProps={{
        //   style: { color: errors?.drivingLicenseInfo?.licenseName ? '#f87272' : `${watch('drivingLicenseInfo.licenseName') ? '' : '#800080'}` },
        // }}
        {...register(`${registerName}.${index}.${fieldNames[0]}`, {
          required: true,
          maxLength: {
            // value: 300,
            value: 100,
            message: 'Length limit exceed',
          },
          pattern: {
            value: /^[A-Za-z\s]+$/,
            message: 'Name can only contain letters and spaces',
          },
        })}
        error={!!fetchByDotOperator(indexError, `${fieldNames[0]}.message`)}
        helperText={fetchByDotOperator(indexError, `${fieldNames[0]}.message`)}
      />
      <TextField
        fullWidth
        className="md:col-span-4  col-span-6"
        size="small"
        value={watch(`${registerName}.${index}.${fieldNames[1]}`)}
        disabled={
          !!additionalDrivers.find((driver) => driver.email === watch(`${registerName}.${index}.${fieldNames[1]}`))?.status ||
          (pathName.includes('travels') && disableButtons)
        }
        label="Email"
        {...register(`${registerName}.${index}.${fieldNames[1]}`, {
          required: true,
          pattern: {
            value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
            message: 'Invalid email format',
          },
          validate: (value) => validateDuplicateEmail(value, index),
        })}
        error={!!fetchByDotOperator(indexError, `${fieldNames[1]}.message`)}
        helperText={fetchByDotOperator(indexError, `${fieldNames[1]}.message`)}
      />
      {/* Phone Input Removed */}
      {/* <div className="md:col-span-4 col-span-10 flex flex-col">
        <Controller
          name={`${registerName}.${index}.${fieldNames[2]}`}
          control={control}
          rules={{ required: true, validate: (value) => validateMobileNumberLength(value, index) }}
          render={({ field }) => (
            <PhoneInput
              {...field}
              country={'au'}
              autoFormat={false}
              placeholder="Contact Number"
              enableSearch={true}
              inputStyle={{ width: '100%', height: '40px' }}
              value={watch(`${registerName}.${index}.${fieldNames[2]}`)}
              onChange={handlePhoneNumChange}
            />
          )}
        />
        {fetchByDotOperator(indexError, `${fieldNames[2]}.message`) && (
          <span className="text-xs text-error">{fetchByDotOperator(indexError, `${fieldNames[2]}.message`)}</span>
        )}
      </div> */}
      {/* show status and send button */}
      {renderButtons()}
      {/* show delete and re-send button */}
      {renderDeleteButton()}

      <Divider className="col-span-12 md:hidden block bg-primary mb-4" orientation="horizontal"></Divider>
      {/* {index === 0 ? (
        <IconButton className="col-span-1 flex" disabled={disableAddBtn || !isValid} onClick={addFieldFn}>
          <IoAddCircleOutline size={25} />
        </IconButton>
      ) : (
        <IconButton className="col-span-1 flex" onClick={() => removeFieldFn(index)}>
          <IoTrashSharp />
        </IconButton>
      )} */}
    </div>
  );
};

export default AdditionalDriverFields;
