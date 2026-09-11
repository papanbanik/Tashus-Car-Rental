'use client';

import DynamicCoverView from '@/components/UserProfileUpdated/DynamicCoverView';
import { useUserCredContext } from '@/context/UserCredProvider';
import { CommonTabProps } from '@/types/componentTypes';
import { iconArrayForProfileTabList, subArrayForProfileTabList, TabListType } from '@/utils/Lists/userProfileListInfo';
import { Divider, IconButton } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useParams, usePathname, useRouter, useSearchParams, useSelectedLayoutSegments } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineMenu } from 'react-icons/ai';
import CommonBreadCrumb, { BreadcrumbItem } from '../Breadcrumbs/CommonBreadCrumb';
import CommonDrawer from '../CommonDrawer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const ProfileUpdatedTab = ({ tabList, children, baseUrl, isSmall }: CommonTabProps) => {
  const { userProfileInfo, userCred } = useUserCredContext();
  const [mainTabIndex, setMainTabIndex] = useState<number>(0);
  const [subTabIndex, setSubTabIndex] = useState<number | null>(null);
  const [activeSubTabIndex, setActiveSubTabIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const segment = useSelectedLayoutSegments();
  const { vehicleId, travelId, reservationId } = useParams<{
    vehicleId: string;
    travelId: string;
    reservationId: string;
  }>();
  const filteredIconArray = userProfileInfo?.isAllowListing
    ? iconArrayForProfileTabList
    : iconArrayForProfileTabList.filter((_, index) => ![1, 2, 4].includes(index));

  useEffect(() => {
    const currentTab = tabList?.find((tab) => segment.includes(tab?.routeName.split('/')[0]));
    const currentTabIndex = currentTab ? parseInt(currentTab?.id || '') - 1 : 0;
    setMainTabIndex(currentTabIndex);

    if (currentTab?.routeName === 'setting') {
      const pathParts = pathName.split('/');
      const lastPathPart = pathParts[pathParts.length - 1];
      // Find the index of the subTabList item where routeName matches lastPathPart
      const matchedIndex = currentTab?.subTabList && currentTab?.subTabList?.findIndex((subTab) => subTab.routeName === lastPathPart);
      setActiveSubTabIndex(matchedIndex !== undefined ? matchedIndex : null);
    }
  }, [tabList, pathName]);

  useEffect(() => {
    if (tabList[mainTabIndex].subTabList) {
      if (activeSubTabIndex !== null) {
        setSubTabIndex(activeSubTabIndex);
      } else {
        setSubTabIndex(0);
      }
    }
  }, [mainTabIndex, tabList]);

  const handleMainTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setMainTabIndex(newValue);
    setSubTabIndex(null);
    const selectedMainTab = tabList[newValue];
    if (selectedMainTab?.subTabList) {
      setSubTabIndex(0);
      router.push(`${baseUrl}/${selectedMainTab.routeName}/${selectedMainTab.subTabList[0].routeName}`);
    } else {
      router.push(`${baseUrl}/${selectedMainTab.routeName}`);
    }
    setDrawerOpen(false); // Close drawer after selection
  };

  const handleSubTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSubTabIndex(newValue);
    const selectedMainTab = tabList[mainTabIndex];
    const selectedSubTab = selectedMainTab.subTabList && selectedMainTab.subTabList[newValue];
    if (selectedSubTab) {
      router.push(`${baseUrl}/${selectedMainTab.routeName}/${selectedSubTab.routeName}`);
    }
  };

  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const vehicleUrlId = searchParams.get('vehicle');

  const profileBreadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    source === 'checkout'
      ? { label: 'Checkout', href: `/search/${vehicleUrlId}/checkout` }
      : {
          label: 'Profile',
          href: `/dashboard/${userCred?.userId}/profile-info`,
        },
    {
      label:
        tabList && mainTabIndex !== null && tabList[mainTabIndex]?.subTabList && subTabIndex !== null
          ? String(tabList?.[mainTabIndex]?.subTabList?.[subTabIndex]?.label || '')
          : String(tabList?.[mainTabIndex]?.label || ''),
    },
  ];
  const isFirstRender = useRef<boolean>(true);
  useEffect(() => {
    if (isSmall && isFirstRender.current) {
      setDrawerOpen(true);
      isFirstRender.current = false;
    }
  }, [isSmall]);
  return (
    <div>
      {!!vehicleId || !!reservationId || !!travelId ? (
        <>{children}</>
      ) : (
        <>
          <div className="flex justify-center">
            <div className="flex w-full lg:w-10/12 gap-2 mb-2 p-2 md:mx-12">
              {isSmall ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex-1">
                      <CommonBreadCrumb items={profileBreadcrumbItems} />
                    </div>
                    <IconButton onClick={() => setDrawerOpen(true)}>
                      <AiOutlineMenu className="text-2xl text-primary" />
                    </IconButton>
                  </div>
                  <CommonDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} buttonClasses="hidden" drawerAnchor="right">
                    <div className="p-4 bg-gradient-to-b from-gray-50 to-gray-100 h-full">
                      <div className="flex justify-end mb-4">
                        <IconButton onClick={() => setDrawerOpen(false)}>
                          <AiOutlineArrowRight className="text-2xl text-primary" />
                        </IconButton>
                      </div>
                      <Tabs
                        value={mainTabIndex}
                        onChange={handleMainTabChange}
                        orientation="vertical"
                        variant="scrollable"
                        sx={{
                          '& .MuiTabs-flexContainer': {
                            gap: '4px',
                          },
                          '& .MuiTabs-indicator': {
                            display: 'none',
                          },
                          '& .MuiTab-root': {
                            transition: 'all 0.3s ease',
                            borderRadius: '8px',
                          },
                          '& .Mui-selected': {
                            backgroundColor: '#800080',
                            color: 'white !important',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        {tabList?.map((tab: TabListType, index: number) => (
                          <Tab
                            key={tab.id}
                            label={
                              <div className="flex items-center gap-3 w-[222px] py-3 px-4">
                                {filteredIconArray[index] &&
                                  React.createElement(filteredIconArray[index], {
                                    className: `text-lg ${mainTabIndex === index ? 'text-white' : 'text-black'}`,
                                  })}
                                <span className="text-base font-medium">{tab.label}</span>
                              </div>
                            }
                            className="normal-case"
                          />
                        ))}
                      </Tabs>
                    </div>
                  </CommonDrawer>
                </div>
              ) : (
                <CommonBreadCrumb items={profileBreadcrumbItems} />
              )}
            </div>
          </div>

          {isSmall ? (
            <div className="bg-white rounded-lg shadow-md shadow-secondary md:mx-12">
              {tabList[mainTabIndex]?.subTabList ? (
                <>
                  <DynamicCoverView title="Settings" />
                  {children}
                </>
              ) : (
                <>{children}</>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex w-full md:w-10/12 gap-2">
                <div className="lg:h-[calc(100vh-9rem)] lg:sticky top-16 hidden lg:flex lg:flex-col bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-lg p-4 pb-6">
                  <Tabs
                    value={mainTabIndex}
                    onChange={handleMainTabChange}
                    orientation="vertical"
                    variant="scrollable"
                    sx={{
                      '& .MuiTabs-flexContainer': {
                        gap: '2px',
                      },
                      '& .MuiTabs-indicator': {
                        display: 'none',
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#800080 !important',
                        color: 'white !important',
                        borderRadius: '8px',
                      },
                      '& .Mui-selected .MuiTab-wrapper': {
                        color: 'white !important',
                      },
                      '& .Mui-selected svg': {
                        color: 'white !important',
                      },
                    }}
                  >
                    {tabList?.map((tab: TabListType, index: number) => (
                      <Tab
                        key={tab.id}
                        label={
                          <div className="flex items-center gap-3 w-[222px] py-2 px-4">
                            {filteredIconArray[index] &&
                              React.createElement(filteredIconArray[index], {
                                className: `text-lg ${mainTabIndex === index ? 'text-white' : 'text-black'}`,
                              })}
                            <span className="text-base font-medium">{tab.label}</span>
                          </div>
                        }
                        className="w-full normal-case"
                      />
                    ))}
                  </Tabs>
                </div>

                <div className="flex-grow bg-white glassmorphism rounded-2xl shadow-lg gradient-bg max-w-5xl p-4 lg:p-0">
                  {tabList[mainTabIndex]?.subTabList && !isSmall ? (
                    <>
                      <DynamicCoverView
                        title="Settings"
                        className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark"
                      />
                      <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <div className="glassmorphism rounded-2xl p-4 gradient-bg-sub">
                          <Tabs
                            value={subTabIndex}
                            onChange={handleSubTabChange}
                            orientation="vertical"
                            variant="scrollable"
                            sx={{
                              '& .Mui-selected': {
                                background: 'linear-gradient(90deg, rgba(128, 0, 128, 0.1), rgba(255, 255, 255, 0.8))',
                                color: '#800080',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                              },
                              color: '#4b5563',
                            }}
                          >
                            {tabList[mainTabIndex].subTabList?.map((subTab: TabListType, subIndex: number) => (
                              <Tab
                                key={subIndex}
                                label={
                                  <div className="flex items-center gap-3 w-full py-2">
                                    {subArrayForProfileTabList[subIndex] &&
                                      React.createElement(subArrayForProfileTabList[subIndex], { className: 'text-primary text-lg' })}
                                    <span className="text-gray-800 font-medium">{subTab.label}</span>
                                  </div>
                                }
                                className="w-full normal-case text-xs whitespace-nowrap"
                              />
                            ))}
                          </Tabs>
                        </div>
                        <div className="hidden md:block">
                          <Divider orientation="vertical" className="py-24 border-primary/20" />
                        </div>
                        <div className="flex-grow rounded-2xl">{children}</div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl">{children}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileUpdatedTab;
