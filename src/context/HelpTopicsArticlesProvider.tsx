'use client';

import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
type HelpTopicsArticlesProviderProps = {
  children: ReactNode;
};

type HelpInfoContextType = {
  allHelpTopics: any;
  setAllHelpTopics: Dispatch<SetStateAction<any>>;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  selectedHomeTab: string;
  setSelectedHomeTab: Dispatch<SetStateAction<string>>;
  allArticleList: any;
  setAllArticleList: Dispatch<SetStateAction<any>>;
  selectedArticle: any;
  setSelectedArticle: Dispatch<SetStateAction<any>>;
  guestArticleList: any;
  setGuestArticleList: Dispatch<SetStateAction<any>>;
  hostArticleList: any;
  setHostArticleList: Dispatch<SetStateAction<any>>;
  filteredArticles: any;
  setFilterArticles: Dispatch<SetStateAction<any>>;
  allLegals: any;
  setAllLegals: Dispatch<SetStateAction<any>>;
  agreementDetails: any;
  setAgreementDetails: Dispatch<SetStateAction<any>>;
  rentalAgreement: any;
  setRentalAgreement: Dispatch<SetStateAction<any>>;
  ownerAgreement: any;
  setOwnerAgreement: Dispatch<SetStateAction<any>>;
};

export const HelpInfo = createContext<HelpInfoContextType | undefined>(undefined);

export const useHelpTopicArticleInfoContext = (): HelpInfoContextType => {
  const context = useContext(HelpInfo);
  if (!context) {
    throw new Error('useContext must be used within a HelpTopicsArticlesProvider');
  }
  return context;
};

export const HelpTopicsArticlesProvider: FC<HelpTopicsArticlesProviderProps> = ({ children }) => {
  const [allHelpTopics, setAllHelpTopics] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState<string>('guest');
  const [selectedHomeTab, setSelectedHomeTab] = useState<string>('guest');
  const [allArticleList, setAllArticleList] = useState([] as any);
  const [selectedArticle, setSelectedArticle] = useState([] as any);
  const [guestArticleList, setGuestArticleList] = useState([] as any);
  const [hostArticleList, setHostArticleList] = useState([] as any);
  const [filteredArticles, setFilterArticles] = useState([] as any);
  const [allLegals, setAllLegals] = useState([] as any);
  const [agreementDetails, setAgreementDetails] = useState({} as any);
  const [rentalAgreement, setRentalAgreement] = useState({} as any);
  const [ownerAgreement, setOwnerAgreement] = useState({} as any);

  const contextValue: HelpInfoContextType = {
    allHelpTopics,
    setAllHelpTopics,
    selectedTab,
    setSelectedTab,
    selectedHomeTab,
    setSelectedHomeTab,
    allArticleList,
    setAllArticleList,
    selectedArticle,
    setSelectedArticle,
    guestArticleList,
    setGuestArticleList,
    hostArticleList,
    setHostArticleList,
    filteredArticles,
    setFilterArticles,
    allLegals,
    setAllLegals,
    agreementDetails,
    setAgreementDetails,
    rentalAgreement,
    setRentalAgreement,
    ownerAgreement,
    setOwnerAgreement,
  };
  return <HelpInfo.Provider value={contextValue}>{children}</HelpInfo.Provider>;
};
