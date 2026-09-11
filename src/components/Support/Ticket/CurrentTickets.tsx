'use client';
import { useGetAllCommentsOfATicketContext } from '@/context/AllCommentsOfATicketProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useGetAllTickets } from '@/hooks/support-center/useGetAllTickets';
import { removeCamelCase } from '@/utils/Functions/randomCommonFn';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BiSolidCircle } from 'react-icons/bi';

const CurrentTickets = (props: any) => {
  const { ticketStatus } = props;
  const router = useRouter();
  const { supportTicketId } = useParams<{ supportTicketId: string }>();
  const { allTickets, setAllComments, setShowChat, setDefaultTab, allComments } = useGetAllCommentsOfATicketContext();
  const { userCred } = useUserCredContext();
  const { refetch: getAllTickets } = useGetAllTickets(ticketStatus);

  useEffect(() => {
    fetchAllTickets();
    setDefaultTab(ticketStatus === 'inprogress' ? 'inprogress' : ticketStatus === 'closed' ? 'closed' : 'current');
  }, [ticketStatus, userCred]);

  const fetchAllTickets = async () => {
    try {
      // console.log(userCred);
      if (ticketStatus && userCred?.userId) {
        getAllTickets();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const filteredTickets = [...allTickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleTicketClick = async (supportTicketId: string) => {
    if (allComments) {
      setAllComments(allComments);
    }
    router.push(`/support/support-ticket/${supportTicketId}`);
    if (isSmall) {
      setShowChat(true);
    }
  };

  return (
    <div className="h-full rounded-xl overflow-y-scroll flex flex-col">
      <List sx={{ width: '100%' }} className="flex-grow">
        {filteredTickets?.length > 0 ? (
          <>
            {filteredTickets.map((item: any) => (
              <div key={item?._id} className="p-0 m-0 cursor-pointer">
                <ListItem
                  alignItems="flex-start"
                  className="p-2 max-w-1/2 m-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                  style={{
                    width: '-webkit-fill-available',
                    backgroundColor: parseInt(item?.supportTicketId) === parseInt(supportTicketId) ? '#D5AAD5' : '#FFFFFF',
                  }}
                  onClick={() => handleTicketClick(item?.supportTicketId)}
                >
                  <ListItemText
                    primary={
                      <span className="normal-case text-black font-bold cursor-pointer">
                        {item?.subject.length > 30 ? `${item?.subject.slice(0, 30)}...` : item?.subject}
                      </span>
                    }
                    secondary={
                      <span className="normal-case flex justify-between items-center cursor-pointer">
                        <span>{removeCamelCase(item?.issueType)}</span>
                        <span>{removeCamelCase(item?.category)}</span>
                        <span className=" flex items-center">
                          <BiSolidCircle
                            className={`mr-1 ${
                              item?.status === 'open'
                                ? 'text-blue-500'
                                : item?.status === 'inprogress'
                                ? 'text-green-600'
                                : item?.status === 'closed'
                                ? 'text-black-500'
                                : ''
                            }`}
                          />
                          {item?.status === 'inprogress' ? 'In-progress' : item?.status === 'open' ? 'Open' : 'Closed'}
                        </span>
                      </span>
                    }
                  />
                </ListItem>
                {/* <Divider component="li" /> */}
              </div>
            ))}
          </>
        ) : (
          <p className="text-center text-gray-400">No Tickets to show</p>
        )}
      </List>
    </div>
  );
};

export default CurrentTickets;
