import { Checkbox, FormControlLabel, FormGroup, IconButton, Link } from '@mui/material';
import { ReactNode } from 'react';
import { IoIosHelpCircleOutline } from 'react-icons/io';
import CommonTooltip from './CommonTooltip';

interface CommonCheckboxProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  label: string | JSX.Element;
  labelLink?: string;
  className?: string;
  icon?: ReactNode;
  checkedIcon?: ReactNode;
  helpingText?: string;
  tooltipText?: string;
}

const CommonCheckbox = ({
  isChecked,
  onChange,
  label,
  labelLink,
  className,
  // icon = <MdOutlineRadioButtonUnchecked className="text-xl" />,
  // checkedIcon = <MdCheckCircle className="text-xl" />,
  icon,
  checkedIcon,
  helpingText,
  tooltipText,
}: CommonCheckboxProps) => {
  return (
    <FormGroup className={`${className ?? 'flex justify-center items-center w-full'}`}>
      <FormControlLabel
        control={<Checkbox onChange={(e) => onChange(e.target.checked)} checked={isChecked} icon={icon} checkedIcon={checkedIcon} />}
        label={
          labelLink ? (
            <div className="flex gap-1 whitespace-nowrap">
              <Link href={labelLink} color="inherit" target="_blank">
                {label}
              </Link>
              {!!tooltipText && (
                <CommonTooltip title={tooltipText} arrow={true}>
                  <IconButton size="small">
                    <IoIosHelpCircleOutline className="text-md" />
                  </IconButton>
                </CommonTooltip>
              )}
            </div>
          ) : (
            label
          )
        }
      />
      {!!helpingText && <span className="helping_text">{helpingText}</span>}
    </FormGroup>
  );
};

export default CommonCheckbox;
