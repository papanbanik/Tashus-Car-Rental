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
      { name: 'Project 1', icon: '' },
      { name: 'Project 2', icon: '' },
      { name: 'Project 1', icon: '' },
      { name: 'Project 2', icon: '' },
      { name: 'Project 1', icon: '' },
    ],
  },
];

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(menuData.find((item) => item.isExpanded)?.name || null);

  const toggleMenu = (menu: React.SetStateAction<string | null>) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div
      style={{
        position: 'relative',
        marginLeft: '1rem',
        height: '100vh',
        width: '16rem',
        border: 'none', // Removes the border
        backgroundColor: 'white', // Sets background to white
        padding: '1.5rem',
        borderRadius: '16px', // Adds rounded corners (adjust as needed)
      }}
    >
      <div style={{ padding: '1rem' }}>
        <h1
          style={{
            borderBottom: '2px solid #4B5563',
            paddingBottom: '0.5rem',
            textAlign: 'center',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#4B5563',
          }}
        >
          Test Menu
        </h1>
      </div>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {menuData.map((item, index) => (
          <li key={index} style={{ position: 'relative', padding: '0.5rem' }}>
            <button
              onClick={() => toggleMenu(item.name)}
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#4B5563' }}>{item.icon}</span>
                <span style={{ marginLeft: '0.5rem', color: '#4B5563', fontSize: '1rem' }}>{item.name}</span>
              </div>
              {item.children && item.children.length > 0 && <span style={{ color: '#4B5563' }}>{activeMenu === item.name ? '▲' : '▼'}</span>}
            </button>
            {activeMenu === item.name && item.children && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '1.5rem',
                    marginTop: '0.5rem',
                    height: `calc(1.25rem * ${item.children.length})`,
                    width: '2px',
                    backgroundColor: '#4B5563',
                  }}
                />
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'none', padding: 0 }}>
                  {item.children.map((child, childIndex) => (
                    <li key={childIndex} style={{ position: 'relative' }}>
                      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4B5563', textDecoration: 'none' }}>
                        <svg
                          style={{ position: 'absolute', left: '-.95rem', top: '-0.5rem', transform: 'rotate(180deg)' }}
                          width="16"
                          height="20"
                          viewBox="0 0 16 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0 0 H12 Q12 1 12 2 V50" stroke="#4B5563" strokeWidth="2" fill="none" />
                        </svg>
                        <span style={{ marginLeft: '.75rem', fontSize: '1rem' }}>{child.name}</span>
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
