'use client';
import { TVoucher } from '@/types/voucher-promotion/promotionTypes';
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
type GetAllCommentsProviderProps = {
  children: ReactNode;
};

type Attachment = {
  filename: string;
  fileInfo: {
    url: string;
  };
};

type CommentType = {
  userId: string;
  supportAgentId: string;
  isSupportAgentComment: boolean;
  comment: string;
  createdDate: string;
  attachments: Attachment[];
};

type CommentsType = {
  attachments: Attachment[];
  category: string;
  comments: CommentType[];
  createdAt: string;
  description: string;
  issueBy: string;
  issueType: string;
  reservationId: string;
  status: string;
  subject: string;
  supportTicketId: string;
  updatedAt: string;
  _id: string;
  returnedKilometersRange: number;
  rentedKilometersRange: number;
  vehicleNickName?: string;
};
type TicketsType = CommentsType[];

type AllCommentsContextType = {
  allComments: CommentsType;
  setAllComments: Dispatch<SetStateAction<CommentsType>>;
  showChat: boolean;
  setShowChat: Dispatch<SetStateAction<boolean>>;
  defaultTab: string;
  setDefaultTab: Dispatch<SetStateAction<string>>;
  allTickets: TicketsType;
  setAllTickets: Dispatch<SetStateAction<TicketsType>>;
  isVehicleUnlisted: boolean;
  setVehicleUnlisted: Dispatch<SetStateAction<boolean>>;
  activeVoucherList: TVoucher[];
  setActiveVoucherList: Dispatch<SetStateAction<TVoucher[]>>;
};

export const GetAllComments = createContext<AllCommentsContextType | undefined>(undefined);

export const useGetAllCommentsOfATicketContext = (): AllCommentsContextType => {
  const context = useContext(GetAllComments);
  if (!context) {
    throw new Error('useContext must be used within a GetAllCommentsProvider');
  }
  return context;
};

export const GetAllCommentsProvider: FC<GetAllCommentsProviderProps> = ({ children }) => {
  const [showChat, setShowChat] = useState<boolean>(false);
  const [defaultTab, setDefaultTab] = useState<string>('current');

  const [allComments, setAllComments] = useState<CommentsType>({} as CommentsType);
  const [allTickets, setAllTickets] = useState<TicketsType>([]);
  const [isVehicleUnlisted, setVehicleUnlisted] = useState<boolean>(false);

  //promotion-voucher-details
  const [activeVoucherList, setActiveVoucherList] = useState<TVoucher[]>([]);

  const contextValue: AllCommentsContextType = {
    allComments,
    setAllComments,
    allTickets,
    setAllTickets,
    showChat,
    setShowChat,
    defaultTab,
    setDefaultTab,
    isVehicleUnlisted,
    setVehicleUnlisted,
    activeVoucherList,
    setActiveVoucherList,
  };
  return <GetAllComments.Provider value={contextValue}>{children}</GetAllComments.Provider>;
};
