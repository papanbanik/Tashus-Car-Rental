'use client';

import CustomSlider from '@/components/Common/HookFormFields/CustomSlider';
import SearchableDropdown from '@/components/Common/HookFormFields/SearchableDropdown';
import SelectColorMenu from '@/components/Common/HookFormFields/SelectColorMenu';
import SingleDatePicker from '@/components/Common/HookFormFields/SingleDatePicker';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import {
  convertFuelDataToOptions,
  shouldDisableExpiryDate,
  validateCarName,
  validateExpiryDate,
  validateOdometer,
} from '@/utils/Functions/carListingCommonFn';
import { carColorList, carTypeList, fuelList, OptionType, transmissionList } from '@/utils/Lists/carListInfo';
import { Box, Container, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect } from 'react';

const CarInfoForm = ({ register, control, watch, formState, handleSubmit, setValue, trigger }: HookFormComponentProps) => {
  const { userCred } = useUserCredContext();
  const { errors, isDirty, touchedFields, isValid, isSubmitting } = formState;

  const { listingId, carData, licenseVerifiedData, setLicenseVerifiedData, setVerifyCar, vehicleFuelList } = useCarListingContext();
  const fuelListUpdated: OptionType[] = vehicleFuelList?.fuelData?.length > 0 ? convertFuelDataToOptions(vehicleFuelList?.fuelData) : fuelList;

  useEffect(() => {
    if (watch('year') && trigger) {
      trigger('year');
    }

    trigger?.('expiry');
  }, [watch('year'), watch('expiry')]);

  return (
    <div className="grid grid-cols-12 gap-4 p-0 mb-8 mt-4">
      {(licenseVerifiedData?.make || carData?.car) && (
        <>
          <TextField
            size="small"
            className="col-span-12 p-0"
            value={watch('carNickName')?.replace(/\s+/g, ' ')}
            label="Vehicle Unique Name"
            {...register('carNickName', {
              required: true,
              validate: validateCarName,
            })}
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: `${watch('carNickName') ? '' : '#f87272'}`,
              },
            }}
            InputLabelProps={{
              style: { color: `${watch('carNickName') ? '' : '#f87272'}` },
            }}
            error={!!errors?.carNickName}
            helperText={
              errors?.carNickName?.message || (
                <span className="helping_text text-slate-500 font-light text-xs">
                  {
                    "This is your vehicle's special name! Pick a catchy, easy-to-remember nickname. Example 1: Your reliable family vehicle might earn the name 'Family Cruiser'. Example 2: Your sporty vehicle could rock the name 'Turbo Beast'. Your chosen name helps others quickly spot and choose your vehicle."
                  }
                </span>
              )
            }
          />

          <TextField
            className="md:col-span-6 col-span-12"
            size="small"
            value={watch('vin') && watch('vin')}
            disabled={!!licenseVerifiedData?.vin || !!carData?.car?.vin}
            // disabled={!!watch('vin')}
            label="Vehicle Identification Number (VIN)"
            {...register('vin', {
              required: true,
              // required: !!licenseVerifiedData?.make,
              pattern: {
                value: /^[A-Za-z0-9\-&+#./_]{1,40}$/, //includes uppercase letters (A-Z), lowercase letters (a-z), digits (0-9), and a specific set of symbols: hyphen (-), ampersand (&), plus sign (+), number sign (#), period (.), forward slash (/), and underscore (_). The backslash () is used to escape the hyphen (-) to avoid creating a character range. String should contain at least 1 character and at most 20 characters.
                message: 'Invalid VIN',
              },
            })}
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: `${watch('vin') ? '' : '#f87272'}`,
              },
            }}
            InputLabelProps={{
              style: { color: `${watch('vin') ? '' : '#f87272'}` },
            }}
            error={!!errors?.vin}
            helperText={errors?.vin?.message}
          />
          <TextField
            size="small"
            className="md:col-span-6 col-span-12 p-0"
            value={watch('make')}
            disabled={!!licenseVerifiedData?.make || !!carData?.car?.make}
            label="Car Make"
            {...register('make')}
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: `${watch('make') ? '' : '#f87272'}`,
              },
            }}
            InputLabelProps={{
              style: { color: `${watch('make') ? '' : '#f87272'}` },
            }}
          />
          <TextField
            size="small"
            className="md:col-span-6 col-span-12 p-0"
            value={watch('model')}
            disabled={!!licenseVerifiedData?.model || !!carData?.car?.model}
            label="Car Model"
            {...register('model')}
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: `${watch('model') ? '' : '#f87272'}`,
              },
            }}
            InputLabelProps={{
              style: { color: `${watch('model') ? '' : '#f87272'}` },
            }}
          />

          <TextField
            className="md:col-span-3 col-span-12 p-0"
            size="small"
            value={watch('year') > 0 ? watch('year') : ''}
            disabled={!!licenseVerifiedData?.year || !!carData?.car?.year}
            label="Registration Year"
            {...register('year', {
              //  validate: validateYear, //removed for urgent car list in production
            })}
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: `${watch('year') ? '' : '#f87272'}`,
              },
            }}
            InputLabelProps={{
              style: { color: `${watch('year') ? '' : '#f87272'}` },
            }}
            error={!!errors?.year}
            helperText={<span className="font-bold">{errors?.year?.message}</span>}
          />

          <Container className="md:col-span-3 col-span-12 p-0">
            <SingleDatePicker
              control={control}
              required={true}
              registerName={'expiry'}
              placeholder="Expiry Date"
              errors={errors?.expiry}
              disablePast={true}
              register={register}
              validateDate={validateExpiryDate}
              minDate={dayjs().add(1, 'day').toDate()}
              pickerHeight="40px"
              disabled={shouldDisableExpiryDate(licenseVerifiedData?.expiry, carData?.car?.expiry)}
            />
          </Container>

          <Container className="md:col-span-6 col-span-12 p-0">
            <SearchableDropdown
              // register={register}
              control={control}
              registerName="transmissionType"
              options={transmissionList}
              label="Transmission Type"
              defaultValue={watch('transmissionType')}
              required={true}
              // required={!!licenseVerifiedData?.make}
            ></SearchableDropdown>
          </Container>

          <Container className="md:col-span-6 col-span-12 p-0">
            <SearchableDropdown
              // register={register}
              control={control}
              registerName="fuelType"
              //options={fuelList}
              options={fuelListUpdated}
              label="Fuel Type"
              defaultValue={watch('fuelType')}
              required={true}
              // required={!!licenseVerifiedData?.make}
            ></SearchableDropdown>
          </Container>

          <Container className="md:col-span-6 col-span-12 p-0">
            <SearchableDropdown
              // register={register}
              control={control}
              registerName="carType"
              options={carTypeList}
              label="Body Type"
              defaultValue={watch('carType')}
              required={true}
              // required={!!licenseVerifiedData?.make}
            ></SearchableDropdown>
          </Container>

          <TextField
            className="md:col-span-5 col-span-10"
            size="small"
            label="Odometer"
            type="number"
            // focused={!watch('mileage.distance')}
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: `${watch('mileage.distance') >= 0 ? '' : '#f87272'}`,
              },
            }}
            InputLabelProps={{
              style: { color: `${watch('mileage.distance') >= 0 ? '' : '#f87272'}` },
            }}
            {...register('mileage.distance', {
              required: true,
              validate: validateOdometer,
            })}
            error={!!errors?.mileage?.distance}
            helperText={errors?.mileage?.distance?.message}
          />
          <Box
            className="md:col-span-1 col-span-2 text-center flex justify-center items-center h-10 border-gray-300 rounded-sm bg-gray-200"
            sx={{ border: 1 }}
          >
            <p>KM</p>
          </Box>
          {/* <div className="lg:col-span-1 p-0 bg-error border border-gray-400 text-center rounded-md ">
                <SelectRadioBtn control={control} required={!!licenseVerifiedData?.make} registerName="mileage.units"></SelectRadioBtn>
              </div> */}
          <TextField
            className="md:col-span-6 col-span-12"
            size="small"
            label="Trim"
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: `${watch('trim') ? '' : '#f87272'}`,
              },
            }}
            InputLabelProps={{
              style: { color: `${watch('trim') ? '' : '#f87272'}` },
            }}
            value={watch('trim').toLocaleUpperCase()}
            {...register('trim', {
              required: true,
              // required: !!licenseVerifiedData?.make,
              maxLength: { value: 60, message: 'Max Length Exceed' },
              // pattern: {
              //   value: /^[a-zA-Z0-9\s\-]{1,20}$/, //includes digits (0-9), letters, space and hyphen
              //   message: 'Invalid Trim',
              // },
            })}
            error={!!errors?.trim}
            helperText={errors?.trim?.message}
          />
          {licenseVerifiedData?.color || (watch('color') && !carColorList.find((car) => car?.value === watch('color'))) ? (
            <TextField
              className="md:col-span-6 col-span-12"
              size="small"
              label="Color"
              value={watch('color')}
              disabled={true}
              {...register('color', {
                required: true,
                // required: !!licenseVerifiedData?.make,
              })}
            />
          ) : (
            <Container className="md:col-span-6 col-span-12 p-0">
              <SelectColorMenu control={control} registerName="color" required={true}></SelectColorMenu>
              {/* <SelectColorMenu control={control} registerName="color" required={!!licenseVerifiedData?.make}></SelectColorMenu> */}
            </Container>
          )}

          <Container className="md:col-span-4 col-span-12 p-0">
            <Typography gutterBottom>Number of seats ({watch('seats')})</Typography>
            <Container className="md:px-2">
              <CustomSlider
                control={control}
                registerName="seats"
                required={true}
                // required={!!licenseVerifiedData?.make}
                defaultValue={watch('seats')}
                errors={errors?.seats}
                minimum={1}
                maximum={12}
              ></CustomSlider>
            </Container>
          </Container>

          <Container className="md:col-span-4 col-span-12 p-0">
            <Typography gutterBottom>Number of doors ({watch('doors')})</Typography>
            <Container className="md:px-2">
              <CustomSlider
                control={control}
                registerName="doors"
                required={true}
                // required={!!licenseVerifiedData?.make}
                defaultValue={watch('doors')}
                errors={errors?.doors}
                minimum={2}
                maximum={7}
              ></CustomSlider>
            </Container>
          </Container>

          <Container className="md:col-span-4 col-span-12 p-0">
            <Typography gutterBottom>Number of windows ({watch('windows')})</Typography>
            <Container className="md:px-2">
              <CustomSlider
                control={control}
                registerName="windows"
                required={true}
                // required={!!licenseVerifiedData?.make}
                defaultValue={watch('windows')}
                errors={errors?.windows}
                minimum={2}
                maximum={7}
              ></CustomSlider>
            </Container>
          </Container>
        </>
      )}
    </div>
  );
};

export default CarInfoForm;
