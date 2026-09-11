import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface InputCheckboxProps {
  label: string | JSX.Element;
  handleChange: (value: any) => void;
  isChecked: boolean;
  labelClassName?: string;
  formClassName?: string;
}

const InputCheckbox = ({ label, handleChange, isChecked, labelClassName, formClassName }: InputCheckboxProps) => {
  return (
    <FormControlLabel
      label={<span className={labelClassName ?? 'text-xs text-gray-500 leading-tight'}>{label}</span>}
      control={
        <Checkbox
          size="small"
          onChange={(e) => {
            handleChange(e.target.checked);
          }}
          checked={isChecked}
          // icon={<Unchecked style={{ fontSize: '20px' }} />}
          // checkedIcon={<Checked style={{ fontSize: '20px' }} />}
        />
      }
      className={formClassName}
    />
  );
};

export default InputCheckbox;
