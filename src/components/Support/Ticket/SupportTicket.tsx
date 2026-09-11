'use client';
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TicketList from './TicketList';
import SupportChat from '../SupportChat/ImagesWithSupportChat';
import { useGetAllCommentsOfATicketContext } from '@/context/AllCommentsOfATicketProvider';
import { useMediaQuery, useTheme } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';
import SupportCenterUpdated from '../SupportCenter/SupportCenterUpdated';

const SupportTicket = () => {
  const { showChat } = useGetAllCommentsOfATicketContext();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const [showSupportCenter, setShowSupportCenter] = useState(false);

  return (
    <div className="lg:px-32 xl:px-52 md:px-24 px-2 max-w-[1600px] mx-auto h-full ">
      <div className="w-full mx-auto mb-6 h-full">
        {!isSmall ? (
          <Grid container spacing={1} className="h-full">
            <Grid item xs={3.5} style={{ height: 'calc(100vh - 70px)' }}>
              <div className="rounded-2xl h-full  bg-[#FAEBFA]">
                <TicketList showSupportCenter={(show: boolean) => setShowSupportCenter(show)} />
              </div>
            </Grid>
            <Grid item xs={8.5} style={{ minHeight: 'calc(100vh - 80px)' }}>
              <div className="h-full ">
                <SupportChat showSupportCenter={showSupportCenter} setShowSupportCenter={setShowSupportCenter} />
              </div>
            </Grid>
          </Grid>
        ) : (
          <Grid container className="h-full -mt-10">
            {!showChat && (
              <Grid item xs={12} style={{ height: 'calc(100vh - 80px)' }}>
                <div className="bg-white rounded-lg h-full">
                  <TicketList showSupportCenter={(show: boolean) => setShowSupportCenter(show)} />
                </div>
              </Grid>
            )}
            {/* {isSmall && showSupportCenter && (
              <div className="h-full w-full flex mt-12 relative">
                <SupportCenterUpdated />

             
                <div
                  onClick={() => setShowSupportCenter(false)}
                  className="absolute -top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-red-500 focus:outline-none"
                >
                  <AiOutlineClose />
                </div>
              </div>
            )} */}
            {showChat && (
              <Grid item xs={12} style={{ height: 'calc(100vh - 80px)' }}>
                <div className="bg-white rounded-lg h-full">
                  <SupportChat showSupportCenter={showSupportCenter} setShowSupportCenter={setShowSupportCenter} />
                </div>
              </Grid>
            )}
          </Grid>
        )}
      </div>
    </div>
  );
};

export default SupportTicket;
