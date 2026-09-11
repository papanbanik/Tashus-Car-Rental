import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Controller } from 'react-hook-form';
import { MultiSelectionProps } from '@/types/componentTypes';
import { IconType } from 'react-icons';
import { FormControlLabel } from '@mui/material';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { ImCheckboxUnchecked } from 'react-icons/im';

const MultiSelection = ({
  control,
  registerName,
  required,
  disabled,
  options,
  onSelectionChange,
}: MultiSelectionProps & { onSelectionChange?: (selected: string[]) => void }) => {
  return (
    <div>
      <Controller
        name={registerName}
        control={control}
        rules={{
          required: required,
        }}
        defaultValue={[]}
        render={({ field }) => (
          <div className="flex gap-2 flex-wrap">
            {options?.map(({ id, label, iName, icon, value }) => {
              const IconComponent = iName ? (icon as IconType) : '';
              const isSelected = iName ? field.value?.includes(iName) : field.value?.includes(value);
              return (
                <FormControlLabel
                  key={id}
                  value={iName || value}
                  control={
                    <Checkbox
                      size="small"
                      className={`pr-1 ${isSelected ? ' text-white' : ''}`}
                      checked={field.value?.includes(iName) || field.value?.includes(value)}
                      onChange={(e) => {
                        const clickedIcon = e.target.value;
                        const currentFeatures = field.value || [];
                        let updatedFeatures;

                        if (currentFeatures.includes(clickedIcon)) {
                          updatedFeatures = currentFeatures.filter((icon: string) => icon !== clickedIcon);
                        } else {
                          updatedFeatures = [...currentFeatures, clickedIcon];
                        }

                        field.onChange(updatedFeatures);
                        if (onSelectionChange) {
                          onSelectionChange(updatedFeatures);
                        }
                      }}
                      disabled={disabled}
                      icon={IconComponent ? <IconComponent /> : <ImCheckboxUnchecked />}
                      checkedIcon={IconComponent ? <IconComponent /> : <IoMdCheckmarkCircleOutline />}
                    />
                  }
                  label={label}
                  labelPlacement="end"
                  className={` px-2 py-1 rounded-xl ${isSelected ? 'bg-primary text-white' : 'bg-purple-100'}`}
                />
              );
            })}
            <input type="hidden" {...field} />
          </div>
        )}
      />
    </div>
  );
};

export default MultiSelection;
