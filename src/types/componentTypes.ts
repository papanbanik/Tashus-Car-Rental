import { CarFeatureType } from '@/utils/Lists/carListInfo';
import { TabListType } from '@/utils/Lists/userProfileListInfo';
import { TimeView } from '@mui/x-date-pickers';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  Control,
  DeepMap,
  FieldError,
  FieldErrors,
  FieldValues,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
  ValidationRule,
} from 'react-hook-form';
import { CarCustomAvailability } from './car-listing/carAvailabilityTypes';
import { TCarBlockDate } from './car-search/availabilityValidationTypes';
import { OptionType, TButtonVariant, TDate } from './commonTypes';

export interface CommonModalProps {
  title: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export interface PasswordFieldProps {
  name: string;
  label: string;
  minLength?: (ValidationRule<number> & { message?: string }) | undefined;
  pattern?: (ValidationRule<RegExp> & { message?: string }) | undefined;
  validate?: (currentValue: string | number) => boolean | string | Promise<boolean | string> | undefined;
  register: UseFormRegister<any>;
  errors?: FieldError | undefined;
  size?: 'small' | 'medium';
}
export interface DatePickerProps extends HookFormFieldProps {
  placeholder: string;
  fieldValue?: Date | string | undefined;
  errors?: FieldError | undefined;
  validateDate?: ((selectedDate: Date) => string | boolean) | undefined;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  disablePast?: boolean;
  disableFuture?: boolean;
  disableHighlightToday?: boolean;
  shouldDisableDate?: ((day: any) => boolean) | undefined;
  pickerHeight?: string;
  errorColor?: boolean;
  showRequired?: boolean;
}

export interface StaticDateCalendarProps extends HookFormFieldProps {
  fieldValue?: Date | string | undefined;
  errors?: FieldError | undefined;
  validateDate?: ((selectedDate: Date) => string | boolean) | undefined;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  disablePast?: boolean;
  disableFuture?: boolean;
  disableHighlightToday?: boolean;
  shouldDisableDate?: ((day: any) => boolean) | undefined;
  pickerHeight?: string;
  errorColor?: boolean;
  handleClosePopover?: () => void;
}

export interface ButtonPrevNextProps {
  prevRoute: string | undefined;
  nextRoute: string | undefined;
  disable?: boolean | undefined;
}

export interface HookFormComponentProps {
  control: Control<any> | undefined;
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  trigger?: UseFormTrigger<any>;
  reset?: (values?: Partial<FieldValues>) => void;
  setError?: UseFormSetError<any>;
  clearErrors?: UseFormClearErrors<any>;
  formState: {
    errors: DeepMap<FieldValues, FieldError>;
    isDirty: boolean;
    isSubmitting: boolean;
    isValid: boolean;
    touchedFields: DeepMap<FieldValues, true>;
  };
}

export interface HookFormFieldProps {
  register: UseFormRegister<any>;
  registerName: string;
  dynamicObjFieldName?: string | undefined;
  control?: Control<any> | undefined;
  label?: string;
  minLength?: (ValidationRule<number> & { message?: string }) | undefined;
  maxLength?: (ValidationRule<number> & { message?: string }) | undefined;
  pattern?: (ValidationRule<RegExp> & { message?: string }) | undefined;
  validate?: (currentValue: string | number) => boolean | string | Promise<boolean | string> | undefined;
  errors?: FieldError | undefined;
  allErrors?: FieldErrors<any> | undefined;
  watch?: UseFormWatch<any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  setError?: UseFormSetError<any>;
  trigger?: UseFormTrigger<any>;
  reset?: (values?: Partial<FieldValues>) => void;
  clearErrors?: UseFormClearErrors<any>;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
}

// export interface SearchableDropdownProps extends HookFormFieldProps {
export interface SearchableDropdownProps extends ControlledFieldProps {
  options: any[];
  children?: React.ReactNode;
  onChange?: (params: any) => void;
  selectedIndex?: number;
  emptyColor?: boolean;
  isLabelShow?: boolean;
  showFlag?: boolean;
  showRequired?: boolean;
}

export interface SelectableDropdownProps extends ControlledFieldProps {
  options: any[];
  children?: React.ReactNode;
  onChange?: (params: any) => void;
  selectedIndex?: number;
  size?: 'small' | 'medium';
  showDisable?: Boolean;
  errorColor?: boolean;
  showRequired?: boolean;
}

export interface ControlledFieldProps extends Omit<HookFormFieldProps, 'register'> {
  control: Control<any> | undefined;
}

export interface CustomSliderProps extends ControlledFieldProps {
  minimum: number | undefined;
  maximum: number | undefined;
}
export interface CustomSwitchProps extends ControlledFieldProps {
  size: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}
export interface CustomCheckBoxProps extends ControlledFieldProps {
  onChange?: (params: any) => void;
  htmlLabel?: ReactNode;
  icon?: ReactNode;
  checkedIcon?: ReactNode;
  helpingText?: string;
  isCustomIcon?: boolean;
}

export interface SingleTimePickerProps extends ControlledFieldProps {
  index: number;
  minDate?: Date;
  maxDate?: Date;
  endType?: boolean;
  handleTimeChange?: (time: Date | null, endType: boolean, index: number) => void;
  handleValidation?: (time: Date | null, endType: boolean, index: number) => void;
  timeError?: boolean;
  fieldValue?: Date;
  shouldDisableTime?: (value: TDate, view: TimeView) => boolean;
}

export interface SelectRadioBtnProps extends ControlledFieldProps {
  options: any[];
  exclusive?: boolean;
  lightColor?: boolean;
  otherValidationFn?: () => void;
  buttonWidth?: string;
}
export interface CommonRadioGroupProps extends ControlledFieldProps {
  options: OptionType[];
  formLabelText?: string;
  isRow?: boolean;
  classNames?: string;
}
export interface BookingFieldsProps extends HookFormFieldProps {
  index: number;
  addFieldFn: () => void;
  removeFieldFn: (index: number) => void;
  disableAddBtn?: boolean;
  errorList?: any | undefined;
  showAdd?: boolean;
}

export interface ImageUploaderProps extends ControlledFieldProps {
  multiple?: boolean;
  onChangeFn: (e: React.SyntheticEvent<EventTarget>) => void;
  isApp?: boolean;
}

export interface CommonTabProps {
  tabList: TabListType[];
  children?: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  baseUrl?: string;
  vehicleNickName?: string;
  isSmall?: boolean;
  isEdit?: boolean;
  showDividers?: boolean;
}
export interface ContactDetailsProps {
  hideTitle?: boolean;
  isPreviousStepVerified?: boolean;
  onVerifyClick?: () => void;
  phoneVerified?: boolean;
}

export interface AddUserNewCommentType {
  status: 'all' | 'open' | 'inprogress' | 'closed';
  commentData: {
    userId: string;
    supportAgentId: string;
    isSupportAgentComment: boolean;
    comment: string;
    attachments: Blob[];
    // attachments: {
    //   filename: string;
    //   fileInfo: {
    //     url: string;
    //   };
    // }[];
  };
  ticketId: string;
}
export type SupportChatValues = {
  comment: string;
  chatPhotosUrl: Blob[];
};

export interface FilterBarProps extends FilterApplyProps {
  showMap: boolean;
  setShowMap: Dispatch<SetStateAction<boolean>>;
}

export interface PriceFilterProps extends FilterApplyProps {
  applyDayRange?: boolean;
}
// export interface PriceFilterProps extends ControlledFieldProps, FilterApplyProps {}
export interface FilterApplyProps {
  submitFn?: (data: any) => any;
}

export interface MultiSelectionProps extends ControlledFieldProps {
  options: CarFeatureType[];
}
export interface CustomRangeSliderProps extends ControlledFieldProps {
  rangeValues?: number[];
  setRangeValues?: Dispatch<SetStateAction<number[]>>;
  maxValue?: number;
  minValue?: number;
}
export interface PickupReturnProps extends HookFormComponentProps {
  classNames?: string;
  disableBlockDates?: Date[];
  customBlockDates?: TCarBlockDate[];
  showUtc?: boolean;
  pickupLabel?: string;
  returnLabel?: string;
}

export interface TopImageSkeleton {
  variant?: 'circular' | 'rectangular' | 'rounded' | 'text';
  height?: number;
  width?: number;
}

export type DrawerAnchor = 'top' | 'left' | 'bottom' | 'right';

export interface CommonDrawerProps {
  children?: React.ReactNode;
  drawerAnchor: DrawerAnchor;
  vehicleNickName?: string;
  drawerWidth?: number | string;
  drawerButton?: ReactNode;
  buttonClasses?: string;
  buttonVariant?: TButtonVariant;
  open?: boolean; // Add open prop
  onClose?: () => void;
  onOpen?: () => void;
}

export interface CommonRatingProps extends ControlledFieldProps {
  precision?: number;
  size?: 'small' | 'medium' | 'large';
}

export interface CommonOTPFieldProps {
  control: any;
  registerName: string;
  handleOnClick?: () => void;
  onChange?: (index: number, truncatedValue: string) => void;
  size?: 'small' | 'medium' | 'large';
  required?: boolean;
  title?: string;
  isVerifying?: boolean;
  isSuccess?: boolean;
  separatorShow?: boolean;
  separatorValue?: string;
  otpDigit?: string[];
  timer: number;
}

export interface IPickupReturnTable {
  customAvailabilities: CarCustomAvailability[];
}

export interface Amount {
  label: string;
  amount: any;
}
