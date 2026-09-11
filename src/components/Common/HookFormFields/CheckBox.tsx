import { CustomCheckBoxProps } from '@/types/componentTypes';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { Controller } from 'react-hook-form';
import Checked from '../../../../public/icons/checked.svg';
import Unchecked from '../../../../public/icons/unchecked.svg';

const CheckBox = ({
  control,
  registerName,
  required,
  disabled,
  label,
  onChange,
  htmlLabel,
  // icon = <Unchecked className="text-xl" />,
  // checkedIcon = <Checked className="text-xl" />,
  icon,
  checkedIcon,
  helpingText,
  isCustomIcon,
}: CustomCheckBoxProps) => {
  return (
    <FormGroup>
      <Controller
        name={registerName}
        control={control}
        rules={{
          required: required,
        }}
        defaultValue={false}
        render={({ field }) => {
          // console.log(field?.value);
          return (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onChange && onChange(e.target.checked);
                    }}
                    checked={field?.value}
                    // icon={icon}
                    // checkedIcon={checkedIcon}
                    icon={isCustomIcon ? icon : <Unchecked className="text-xl" />}
                    checkedIcon={isCustomIcon ? checkedIcon : <Checked className="text-xl" />}
                    disabled={disabled}
                  />
                }
                label={label || htmlLabel}
              />
              {!!helpingText && <span className="helping_text">{helpingText}</span>}
            </>
          );
        }}
      />
    </FormGroup>
  );
};

export default CheckBox;
