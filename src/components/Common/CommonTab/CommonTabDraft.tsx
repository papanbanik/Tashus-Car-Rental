'use client';

import { CommonTabProps } from '@/types/componentTypes';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;
  return <>{value === index && <>{children}</>}</>;
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const CommonTabDraft = ({ tabList, children, orientation, baseUrl, showDividers }: CommonTabProps) => {
  const [value, setValue] = useState<number>(0);
  const router = useRouter();
  const segment = useSelectedLayoutSegments();

  useEffect(() => {
    const currentTab = tabList?.find((tab) => segment.includes(tab?.routeName.split('/')[0]));
    const currentTabValue = currentTab ? parseInt(currentTab?.id || '') - 1 : 0;
    setValue(currentTabValue);
  }, [tabList]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.push(`${baseUrl}/${tabList[newValue]?.routeName}`);
  };

  return (
    <div className={`w-full flex ${orientation ? 'flex-row' : 'flex-col'} justify-center items-center`}>
      <Tabs
        orientation={orientation || 'horizontal'}
        value={value}
        variant="scrollable"
        scrollButtons={false}
        allowScrollButtonsMobile={false}
        onChange={handleChange}
        className="flex md:flex-col md:justify-center md:items-center max-w-full glassmorphism rounded-lg px-2"
        sx={{
          minHeight: 0,
          padding: 0,
          margin: 0,
          '& .MuiTabs-indicator': {
            backgroundColor: '#800080',
            height: '2px',
            bottom: 0,
          },
          '& .MuiTab-root': {
            minHeight: 'unset',
            height: '34px',
            padding: '6px 16px',
            lineHeight: 1.2,
            margin: 0,
          },
          '& .MuiTabs-flexContainer': {
            gap: '8px',
          },
        }}
      >
        {tabList?.map((tab, index) => (
          <Tab
            key={tab.id}
            label={tab.label}
            {...a11yProps(parseInt(tab.id) - 1)}
            className="normal-case font-medium transition-all duration-300 hover:bg-gray-100 hover:rounded-md"
            sx={{
              fontSize: '14px', // Matching sorting text size
              '&.Mui-selected': {
                color: '#800080',
                fontWeight: 'bold',
                backgroundColor: 'rgba(128, 0, 128, 0.05)',
                borderRadius: '6px',
              },
              color: '#4b5563',
              minHeight: 'unset',
              height: '34px',
              padding: '6px 16px',
              lineHeight: 1.2,
              margin: 0,
              borderRight: orientation !== 'vertical' && showDividers && tab.id !== `${tabList.length}` ? '1px solid #e5e7eb' : 'none',
              borderBottom: orientation === 'vertical' && showDividers && tab.id !== `${tabList.length}` ? '1px solid #e5e7eb' : 'none',
            }}
            onClick={() => {
              setValue(index);
              router.push(`${baseUrl}/${tab.routeName}`);
            }}
          />
        ))}
      </Tabs>
      {children}

      <style jsx>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default CommonTabDraft;
