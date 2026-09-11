'use client';

import React, { useState } from 'react';
import { FaFolder, FaCog, FaUserCircle } from 'react-icons/fa';

const menuData = [
  {
    name: 'Projects',
    icon: <FaFolder />,
    isExpanded: false,
    children: [
      { name: 'Project 1', icon: '' },
      { name: 'Project 2', icon: '' },
    ],
  },
  {
    name: 'Settings',
    icon: <FaCog />,
    isExpanded: false,
    children: [
      { name: 'My Profile', icon: <FaUserCircle /> },
      { name: 'Security', icon: '' },
    ],
  },
  {
    name: 'Test2',
    icon: <FaCog />,
    isExpanded: false,
  },
  {
    name: 'Projects 3',
    icon: <FaFolder />,
    isExpanded: true,
    children: [
      { name: 'Project 1', icon: '' },
      { name: 'Project 2', icon: '' },
    ],
  },
  {
    name: 'Projects 5',
    icon: <FaFolder />,
    isExpanded: false,
    children: [
      { name: 'Project 1', icon: '' },
      { name: 'Project 2', icon: '' },
    ],
  },
];

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(menuData.find((item) => item.isExpanded)?.name || null);

  const toggleMenu = (menu: React.SetStateAction<string | null>) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className="relative ml-4 h-screen w-64 border border-[#4B5563] bg-transparent p-6">
      <div className="p-4">
        <h1 className="border-b-2 border-[#4B5563] pb-2 text-center text-lg font-bold text-gray-700">Test Menu</h1>
      </div>
      <ul className="space-y-2">
        {menuData.map((item, index) => (
          <li key={index} className="relative p-2">
            <button onClick={() => toggleMenu(item.name)} className="flex w-full items-center justify-between space-x-2">
              <div className="flex flex-row items-center">
                <span className="text-gray-700">{item.icon}</span>
                <span className="ml-2 text-gray-700">{item.name}</span>
              </div>
              {item.children && item.children.length > 0 && <span className="ml-auto text-gray-700">{activeMenu === item.name ? '▲' : '▼'}</span>}
            </button>
            {activeMenu === item.name && item.children && (
              <>
                <div className="absolute left-4 top-6 mt-2 h-[calc(1.5rem*2)] w-[2px] bg-[#4B5563]" />
                <ul className="ml-[25px] mt-2 space-y-1">
                  {item.children.map((child, childIndex) => (
                    <li key={childIndex} className="relative">
                      <a href="#" className="flex items-center space-x-2 text-gray-700">
                        <svg
                          className="absolute -left-5 top-[-3px]"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ transform: 'rotate(180deg)' }}
                        >
                          <path d="M0 0 H12 Q12 1 12 2 V6" stroke="#4B5563" strokeWidth="2" fill="none" />
                        </svg>
                        <span className="ml-6">{child.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
