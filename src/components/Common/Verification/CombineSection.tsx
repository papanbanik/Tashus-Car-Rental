import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { ExpandableHelpingBoxProps } from '@/types/user-verification/verificationListingSteps';
import { Drawer, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import CommonExpand from './CommonExpand';
import MultipleHelpingBox from './MultipleHelpingBox';

const ExpandableHelpingBox = ({
  title,
  children,
  helpingBoxes,
  expanded: expandedProp = true,
  onToggle,
  isNotExpand,
  showStatus,
  status,
  helpingText,
  message,
  isMandatory,
  showRequiredHelpingText,
}: ExpandableHelpingBoxProps) => {
  const [expanded, setExpanded] = useState<boolean>(expandedProp);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const isIPadPro = useIPadProQuery();
  const isSmallScreen = useMediaQuery('(max-width:1200px)');
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setExpanded(!expanded);
    }
  };
  return (
    <div className="my-4 flex lg:flex-row gap-2">
      <div
        className={`w-full ${isIPadPro ? 'w-full' : ''} ${
          !expanded ? `${isIPadPro ? 'w-full' : 'lg:w-full'}` : `${isIPadPro ? 'w-full' : 'lg:w-2/3'}`
        } `}
      >
        {/* <div className="w-full"> */}
        <CommonExpand
          isNotExpand={isNotExpand}
          title={title}
          isExpanded={expanded}
          handleExpand={handleToggle}
          showIcon={isSmallScreen}
          handleIconClick={() => setDrawerOpen(true)}
          showStatus={showStatus}
          status={status}
          helpingText={helpingText}
          message={message}
          isMandatory={isMandatory}
          showRequiredHelpingText={showRequiredHelpingText}
        >
          {children}
        </CommonExpand>
      </div>
      {!isSmallScreen ? (
        <div className={`w-full lg:w-1/3 flex flex-col ${expanded ? '' : 'hidden'}`}>
          <MultipleHelpingBox helpingBoxes={helpingBoxes} />
        </div>
      ) : (
        <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <div className="p-4">
            <MultipleHelpingBox helpingBoxes={helpingBoxes} setDrawerOpen={setDrawerOpen} />
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default ExpandableHelpingBox;
