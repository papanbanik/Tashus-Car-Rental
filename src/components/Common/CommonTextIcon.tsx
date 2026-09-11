'use client';
import { Grid } from '@mui/material';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { ReactNode } from 'react';

interface CommonTextIconProps extends TypographyProps {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  text: string | JSX.Element;
  wrapAround?: boolean;
  textClassName?: string;
}

const CommonTextIcon = ({ startIcon, endIcon, text, wrapAround, textClassName, ...typographyProps }: CommonTextIconProps) => {
  return (
    <>
      {!wrapAround ? (
        <Grid container alignItems="center">
          {startIcon && (
            <Grid item>
              <span className="flex items-center justify-center w-full h-full">{startIcon}</span>
            </Grid>
          )}
          <Grid item>
            <Typography {...typographyProps}>{text}</Typography>
          </Grid>
          {endIcon && (
            <Grid item className="flex items-center justify-center">
              <span className="flex items-center justify-center">{endIcon}</span>
            </Grid>
          )}
        </Grid>
      ) : (
        <div className="inline-flex items-start">
          {startIcon && <span className="flex-shrink-0 items-center mr-2">{startIcon}</span>}
          <span className={`${textClassName ? textClassName : 'inline-block'}`}>{text}</span>
          {endIcon && <span className="flex-shrink-0 ml-2">{endIcon}</span>}
        </div>
      )}
    </>
  );
};

export default CommonTextIcon;
