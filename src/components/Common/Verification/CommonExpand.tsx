'use client';
import { colorType } from '@/types/user-verification/userVerificationTypes';
import { CommonExtendedExpandProps } from '@/types/user-verification/verificationListingSteps';
import { ECommonText } from '@/utils/Functions/randomCommonFn';
import { ExpandMore, getTextColorClass } from '@/utils/Functions/verification/verificationStyleFn';
import { Button, CardActions, CardContent, Chip, Collapse } from '@mui/material';
import { FaChevronDown } from 'react-icons/fa';

const CommonExpand = ({
  title,
  children,
  isExpanded,
  handleExpand,
  showIcon,
  handleIconClick,
  isNotExpand,
  showStatus,
  status,
  helpingText,
  message,
  isMandatory,
  showRequiredHelpingText,
}: CommonExtendedExpandProps) => {
  const adjustedIsExpanded = isNotExpand ? true : isExpanded;
  return (
    <div className={`border border-solid ${!!message ? 'border-error' : 'border-accent'} rounded-lg p-2 ${isExpanded ? 'h-full' : ''}`}>
      <CardActions disableSpacing>
        {/* <CommonTextIcon text={title} className='text-lg font-bold' endIcon={showIcon ? <MdOutlineInfo onClick={handleIconClick}/>:''}/> */}
        {showStatus && status === 'declined' ? (
          <>
            <div className="flex items-center gap-1">
              <span className="text-md md:text-lg font-bold">
                {title}
                {isMandatory && <span className="text-error">{ECommonText.RequiredSign}</span>}
              </span>
              <Chip label={`${status}`} size="small" className="capitalize" variant="outlined" color={getTextColorClass(status) as colorType} />
            </div>
            {showRequiredHelpingText && <span className="helping_text">{ECommonText.RequiredHelpingText}</span>}
          </>
        ) : (
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <span className="text-md md:text-lg font-bold">
                {title} {isMandatory && <span className="text-error">{ECommonText.RequiredSign}</span>}
              </span>
              {showIcon ? (
                <Button variant="text" className="normal-case underline text-sm" size="small" onClick={handleIconClick}>
                  Guidelines
                </Button>
              ) : (
                ''
              )}
            </div>
            {!!message && <span className="helping_text">{message}</span>}
            {!!helpingText && <span className="font-bold text-xs text-error">{helpingText}</span>}
            {showRequiredHelpingText && <span className="helping_text">{ECommonText.RequiredHelpingText}</span>}
          </div>
        )}
        {/* {showIcon ? <MdOutlineInfo onClick={handleIconClick} /> : ''} */}
        {/* <ExpandMore expand={isExpanded} onClick={handleExpand} aria-expanded={isExpanded} aria-label="show more">
          <FaChevronDown />
        </ExpandMore> */}
        {!isNotExpand && (
          <ExpandMore expand={isExpanded} onClick={handleExpand} aria-expanded={isExpanded} aria-label="show more" className="text-md md:text-lg">
            <FaChevronDown />
          </ExpandMore>
        )}
      </CardActions>
      <Collapse in={adjustedIsExpanded} timeout="auto" unmountOnExit>
        <CardContent>{children}</CardContent>
      </Collapse>
    </div>
  );
};

export default CommonExpand;
