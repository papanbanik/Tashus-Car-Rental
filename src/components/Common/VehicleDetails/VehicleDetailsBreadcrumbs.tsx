import React from 'react';
import CommonBreadCrumb from '../Breadcrumbs/CommonBreadCrumb';
import { useSearchParams } from 'next/navigation';

interface VehicleDetailsBreadcrumbsProps {
  carTitle: string;
}

const VehicleDetailsBreadcrumbs: React.FC<VehicleDetailsBreadcrumbsProps> = ({ carTitle }) => {
  const searchParams = useSearchParams();

  const searchUrl = `/search?country=au&region=AU-NSW&pickup=${searchParams?.get('pickup')}&return=${searchParams.get(
    'return'
  )}&city=Sydney&address=Sydney, New South Wales, Australia&lat=0&long=0&postcode=`;

  const vehicleDetailsBreadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Search', href: searchUrl }, { label: `${carTitle}` }];

  return (
    <div className="mb-4 lg:mt-12 mt-2">
      <CommonBreadCrumb items={vehicleDetailsBreadcrumbItems}></CommonBreadCrumb>
    </div>
  );
};

export default VehicleDetailsBreadcrumbs;
