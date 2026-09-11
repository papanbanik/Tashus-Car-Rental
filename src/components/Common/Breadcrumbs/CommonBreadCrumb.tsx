import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { FaHome } from 'react-icons/fa';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CommonBreadCrumbProps {
  items: BreadcrumbItem[];
  maxItems?: number;
  separator?: string;
  icon?: ReactNode;
}

const CommonBreadCrumb: React.FC<CommonBreadCrumbProps> = ({ items, maxItems, separator, icon }) => {
  return (
    <Breadcrumbs separator={separator ?? '/'} maxItems={maxItems ?? 3} aria-label="breadcrumb" className="text-sm">
      {items.map((item, index) =>
        item.href ? (
          <Link key={index} className="hover:underline no-underline" href={item.href} style={{ textDecoration: 'none' }}>
            <div className="flex items-center">
              {index === 0 && <>{!!icon ? icon : <FaHome className="mr-2" />}</>}
              {item.label}
            </div>
          </Link>
        ) : (
          <Typography key={index} color="text.primary" className="text-sm">
            {item.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
};

export default CommonBreadCrumb;
