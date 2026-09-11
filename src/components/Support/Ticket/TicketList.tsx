'use client';
import { useGetAllCommentsOfATicketContext } from '@/context/AllCommentsOfATicketProvider';
import { ClickAwayListener, Tooltip, useMediaQuery } from '@mui/material';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaPlusCircle, FaQuestionCircle } from 'react-icons/fa';
import CurrentTickets from './CurrentTickets';
import { useRouter } from 'next/navigation';

interface TicketListProps {
  showSupportCenter: (show: boolean) => void;
}

const TicketList: React.FC<TicketListProps> = ({ showSupportCenter }) => {
  const [open, setOpen] = React.useState(false);
  const isSmallOrMedium = useMediaQuery('(max-width: 768px)');
  const { defaultTab } = useGetAllCommentsOfATicketContext();
  const [selectedTab, setSelectedTab] = useState<string>(defaultTab);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue);
  };
  const { showChat, setShowChat } = useGetAllCommentsOfATicketContext();
  const ticketStatus = ['open', 'inprogress', 'closed'];
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  const router = useRouter();
  const handleClick = () => {
    if (isSmallOrMedium) {
      // If the device is small or medium, navigate to a different page
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/support/support-center/general?from=general`);
    } else {
      // Otherwise, show the support center modal or whatever you intend to do
      showSupportCenter(true);
    }
  };
  return (
    <div className="h-full flex flex-col ">
      <div style={{ display: 'flex', alignItems: 'center' }} className="justify-between ">
        <Tabs className="my-2" value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="New" value="current" />
          <Tab label="In Progress" value="inprogress" />
          <Tab label="Closed" value="closed" />
        </Tabs>

        <ClickAwayListener onClickAway={handleTooltipClose}>
          <div className="">
            {/* <Tooltip
              enterTouchDelay={0}
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={
                <span>
                  Need help? Please
                  <Typography component="span" variant="subtitle1">
                    <Link href="/support/support-center/general?from=general" className="mx-2 text-purple-300 underline">
                      create a support ticket
                    </Link>
                  </Typography>
                  {' and then chat with our customer care executive'}
                </span>
              }
            >
              <span className="mr-8" onClick={handleTooltipOpen}>
                <FaQuestionCircle />
              </span>
            </Tooltip> */}
          </div>
        </ClickAwayListener>
      </div>
      <Divider />
      <>
        {selectedTab === 'current' ? <CurrentTickets ticketStatus={ticketStatus[0]} /> : null}
        {selectedTab === 'inprogress' ? <CurrentTickets ticketStatus={ticketStatus[1]} /> : null}
        {selectedTab === 'closed' ? <CurrentTickets ticketStatus={ticketStatus[2]} /> : null}
      </>
      {/* <Link href="/support/support-center/general?from=general" className="w-full no-underline"> */}
      <div
        // onClick={handleClick}
        onClick={() => {
          showSupportCenter(true);
          setShowChat(true);
        }}
        className="bg-[#5C8D07] p-4 mr-6 ml-2 mb-2 mt-2 rounded-lg text-white text-lg text-center border-none transition-colors duration-300 hover:bg-[#4a7d05] flex justify-center items-center cursor-pointer"
      >
        <FaPlusCircle className="mr-2" /> Create a Support Ticket
      </div>
      {/* </Link> */}
    </div>
  );
};

export default TicketList;
