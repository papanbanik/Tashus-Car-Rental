'use client';

import { ECommonText } from '@/utils/Functions/randomCommonFn';
import { Typography } from '@mui/material';
import React from 'react';

const SectionHeader = ({
  title,
  subtitle,
  children,
  textSize,
  noMargin,
  fontStyle,
  isOptional,
  isMandatory,
  showRequiredHelpingText,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  textSize?: string;
  noMargin?: boolean;
  fontStyle?: string;
  isOptional?: boolean;
  isMandatory?: boolean;
  showRequiredHelpingText?: boolean;
}) => {
  return (
    <div className={`${noMargin ? 'm-0' : 'mb-6'}`}>
      <div className="flex items-center">
        <Typography className={`${fontStyle ?? 'font-semibold'} ${textSize ?? 'md:text-2xl text-xl'}`}>
          {title} {isMandatory && <span className="text-error">{ECommonText.RequiredSign}</span>}
          {isOptional && <span className="helping_text gap-2">{ECommonText.OptionalText}</span>}
        </Typography>
        {showRequiredHelpingText && <span className="text-sm text-accent">{ECommonText.RequiredHelpingText}</span>}
        {children}
      </div>
      {subtitle && <Typography className="md:text-sm text-sm font-thin text-gray-400 italic text-left">{subtitle}</Typography>}
    </div>
  );
};

export default SectionHeader;
