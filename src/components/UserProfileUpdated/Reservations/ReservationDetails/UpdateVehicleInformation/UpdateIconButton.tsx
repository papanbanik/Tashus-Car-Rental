import CommonTooltip from '@/components/Common/CommonTooltip';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { CgCloseR } from 'react-icons/cg';
import { CiEdit } from 'react-icons/ci';

interface UpdateIconButton {
  isEditable: boolean;
  handleChangeEditable: () => void;
  isDisabled: boolean;
}

const UpdateIconButton = ({ isEditable, handleChangeEditable, isDisabled }: UpdateIconButton) => {
  return (
    <CommonTooltip title={isEditable ? 'Close Update Form' : 'Update'} arrow={true} placement="top">
      <IconButton disabled={isDisabled} onClick={handleChangeEditable}>
        {isEditable ? (
          <span className="text-error">
            <CgCloseR />
          </span>
        ) : (
          <CiEdit className={`${isDisabled ? '' : 'text-primary'}`} />
        )}
      </IconButton>
    </CommonTooltip>
  );
};

export default UpdateIconButton;
