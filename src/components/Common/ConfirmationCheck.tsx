import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography/Typography';
import { ReactNode, useState } from 'react';

interface IConfirmationCheck {
  title: string;
  subTitle?: string;
  agreeButtonText: string;
  disagreeButtonText: string;
  disableAgreeButton?: boolean;
  disableDisagreeButton?: boolean;
  agreeButtonAction: (params?: any) => void;
  disagreeButtonAction: () => void;
  children?: ReactNode;
  isDisableOnAgreeClick?: boolean;
}

const ConfirmationCheck = ({
  title,
  agreeButtonAction,
  subTitle,
  agreeButtonText,
  disagreeButtonAction,
  disagreeButtonText,
  disableAgreeButton,
  disableDisagreeButton,
  children,
  isDisableOnAgreeClick = false,
}: IConfirmationCheck) => {
  const [localDisableAgree, setLocalDisableAgree] = useState<boolean>(false);
  const handleAgreeClick = async () => {
    setLocalDisableAgree(true);
    await agreeButtonAction();
  };
  return (
    <div>
      <Typography align="center" className="font-semibold md:text-2xl text-xl">
        {title}
      </Typography>
      <Typography variant="subtitle2" align="center" className="helping_text">
        {subTitle}
      </Typography>

      {children}

      <div className="flex justify-center mt-8 gap-6">
        <Button
          variant="outlined"
          color="error"
          size="small"
          className={`${disableDisagreeButton ? 'bg-gray-100' : 'bg-red-100'}`}
          disabled={disableDisagreeButton}
          onClick={disagreeButtonAction}
        >
          {disagreeButtonText}
        </Button>
        <Button
          variant="outlined"
          color="success"
          size="small"
          className={`${disableAgreeButton ? 'bg-gray-100' : 'bg-green-100'}`}
          disabled={isDisableOnAgreeClick ? localDisableAgree : disableAgreeButton}
          onClick={isDisableOnAgreeClick ? handleAgreeClick : agreeButtonAction}
        >
          {agreeButtonText}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationCheck;
