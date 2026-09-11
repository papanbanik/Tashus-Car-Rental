import SelectRadioBtn from '@/components/Common/HookFormFields/SelectRadioBtn';
import { BookingFieldsProps } from '@/types/componentTypes';
import { maxTripDuration as discountType } from '@/utils/Lists/carListInfo';
import { Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import { IoAddCircleOutline, IoTrashSharp } from 'react-icons/io5';

export const BookingFields = ({
  register,
  control,
  index,
  addFieldFn,
  watch,
  registerName,
  removeFieldFn,
  disableAddBtn,
  errorList,
  trigger,
  setValue,
  clearErrors,
  setError,
  showAdd,
}: BookingFieldsProps) => {
  const unitValue = watch && watch(`${registerName}.${index}.unit`);
  const tempList = watch && watch(`${registerName}`);

  const validateDiscountField = (value: any) => {
    if (unitValue && (parseFloat(value) > 100 || parseFloat(value) <= 0)) {
      return 'Invalid %';
    }

    if (!unitValue && setValue) {
      setValue(`${registerName}.${index}.percentage`, '');
    }
  };

  const findDuplicates = async (list: any) => {
    const updatedList = list.map((item: any, ind: any) => ({ ...item, ind })).filter((item: any) => item.value !== '');
    const itemMap = new Map();
    const duplicateList: any = [];
    const uniqueList: any = [];

    updatedList.forEach((item: any) => {
      const key = `${item.value}-${item.unit}`;
      if (itemMap.has(key)) {
        duplicateList.push(item);
      } else {
        uniqueList.push(item);
        itemMap.set(key, true);
      }
    });

    return { duplicateList, uniqueList };
  };

  const validateDaysWeeks = async (value: any) => {
    if (unitValue) {
      const { duplicateList, uniqueList } = await findDuplicates(tempList);
      const isDuplicate = duplicateList?.find((temp: any, ind: number) => temp.value === value && temp.unit === unitValue);
      // console.log('duplicateList', duplicateList);
      // console.log('uniqueList', uniqueList);
      // console.log(isDuplicate);

      if (isDuplicate) {
        return 'Duplicate';
      }

      if (uniqueList?.length > 0) {
        uniqueList?.map((temp: any, ind: number) => {
          clearErrors && clearErrors(`${registerName}.${temp.ind}.value`);
        });
      }
      // if (duplicateList?.length === 0) {
      //   tempList?.map((temp: any, ind: number) => {
      //     clearErrors && clearErrors(`${registerName}.${ind}.value`);
      //   });
      // }

      if (value <= 0) {
        return 'Invalid';
      }
    } else {
      setValue && setValue(`${registerName}.${index}.value`, '');
    }
  };

  const triggerValidation = () => {
    if (trigger) {
      tempList?.map((temp: any, ind: number) => {
        trigger(`${registerName}.${ind}.value`);
        trigger(`${registerName}.${ind}.percentage`);
      });
    }
  };

  return (
    <Grid item container className="mb-4">
      <Grid item xs={3} sm={3} md={3} lg={3} xl={3} className="">
        <TextField
          size="small"
          className="md:text-sm text-xs md:mr-0 mr-2"
          label={watch && watch(`${registerName}.${index}.unit`) === 'days' ? 'Input' : 'Input'}
          // label={watch && watch(`${registerName}.${index}.unit`) === 'days' ? 'Days' : 'Weeks'}
          type="number"
          disabled={!unitValue}
          value={watch && watch(`${registerName}.${index}.value`)}
          sx={{
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: watch && watch(`${registerName}.${index}.value`) ? '' : '#800080',
            },
            '& .MuiOutlinedInput-root': {
              paddingRight: 0,
            },
          }}
          InputLabelProps={{
            style: { color: watch && watch(`${registerName}.${index}.value`) ? '' : '#800080' },
          }}
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
            maxLength: 5,
            onInput: (event) => {
              event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
            },
          }}
          {...register(`${registerName}.${index}.value`, {
            required: !!unitValue,
            pattern: {
              value: /^[0-9]{1,4}$/, //includes digits (0-9) and max 4 characters
              message: 'Invalid',
            },
            validate: validateDaysWeeks,
          })}
          error={errorList && !!errorList[index]?.value}
          helperText={errorList && errorList[index]?.value?.message}
        />
      </Grid>
      <Grid item md={1} lg={1} xl={1} className=""></Grid>
      <Grid item xs={4} sm={4} md={3} lg={3} xl={3} className="">
        <SelectRadioBtn
          control={control}
          registerName={`${registerName}.${index}.unit`}
          options={discountType}
          exclusive={true}
          otherValidationFn={triggerValidation}
          watch={watch}
        ></SelectRadioBtn>
      </Grid>
      <Grid item container xs={4} sm={4} md={4} lg={4} xl={4} className="flex md:justify-around justify-between">
        <Grid item xs={3} sm={3} md={4} lg={4} xl={4}>
          <p className="font-semibold md:text-lg text-sm md:p-0 pl-1 mt-2">Offer</p>
        </Grid>
        <Grid item xs={7} sm={7} md={8} lg={8} xl={8}>
          <TextField
            size="small"
            label="Rate"
            type="text"
            disabled={!unitValue}
            value={watch && watch(`${registerName}.${index}.percentage`)}
            inputProps={{ inputMode: 'numeric', pattern: '^\\d{0,3}(\\.\\d{0,2})?$', step: '0.01' }}
            sx={{
              '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: watch && watch(`${registerName}.${index}.percentage`) ? '' : '#800080',
              },
              '& .MuiOutlinedInput-root': {
                paddingRight: 0,
              },
            }}
            InputLabelProps={{
              style: { color: watch && watch(`${registerName}.${index}.percentage`) ? '' : '#800080' },
            }}
            {...register(`${registerName}.${index}.percentage`, {
              required: !!unitValue,
              pattern: {
                value: /^\d{1,3}(\.\d{1,2})?$/, //includes positive digits (0-9), supports decimal, 5 characters before . and 2 after decimal
                message: 'Invalid %',
              },
              validate: validateDiscountField,
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment className="bg-gray-200 md:px-4 px-0 h-10 rounded-e-md max-h-10" position="end">
                  <p>%</p>
                </InputAdornment>
              ),
            }}
            error={errorList && !!errorList[index]?.percentage}
            helperText={errorList && errorList[index]?.percentage?.message}
          />
        </Grid>
      </Grid>
      {index === 0 && !showAdd ? (
        <Grid item xs={1} sm={1} md={1} lg={1} xl={1} className="">
          <IconButton disabled={disableAddBtn || !unitValue} onClick={addFieldFn}>
            <IoAddCircleOutline size={25} />
          </IconButton>
        </Grid>
      ) : (
        <Grid item xs={1} sm={1} md={1} lg={1} xl={1} className="">
          <IconButton className="" onClick={() => removeFieldFn(index)}>
            <IoTrashSharp />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};
