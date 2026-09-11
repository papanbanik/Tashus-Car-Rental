'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { FilterBarProps } from '@/types/componentTypes';
import { filterButtonsList } from '@/utils/Lists/searchInfo';
import { Button } from '@mui/material';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { FaArrowRight } from 'react-icons/fa';

const FilterBar = ({ showMap, setShowMap }: FilterBarProps) => {
  const { openModal } = useModalContext();
  const { selectedFilters, setSelectedFilters } = useSearchContext();
  const { userCred } = useUserCredContext();
  const checkActiveFilter = (name: string) => {
    // console.log(name);
    if (selectedFilters.length > 0) {
      return selectedFilters?.find((filter) => filter.name === name) ? 'bg-secondary' : '';
    }
  };

  // console.log(selectedFilters);
  const baseUrl = userCred?.loggedIn
    ? `${process.env.NEXT_PUBLIC_DOMAIN}/au/verify-account/${userCred?.userId}`
    : `${process.env.NEXT_PUBLIC_DOMAIN}/get-verified`;
  return (
    <div className="flex flex-wrap md:justify-start justify-center items-center gap-2 my-4">
      {/* <div className="flex overflow-x-scroll whitespace-nowrap items-center md:gap-3 gap-6 mt-4 bg-error h-9"> */}
      <Link target="_blank" href={baseUrl} className="text-white inline-block no-underline">
        <Button variant="contained" color="primary" className="normal-case" endIcon={<FaArrowRight />}>
          Verify your ID
        </Button>
      </Link>
      {filterButtonsList?.map((filterButton) => {
        const { id, name, label, component, modalTitle, icon } = filterButton;
        const IconComponent = icon as IconType;
        return (
          <div key={id} className="flex md:justify-start justify-center items-center flex-wrap w-auto p-0">
            <Button
              className={`text-primary text-md justify-between items-center gap-2 normal-case ${checkActiveFilter(name)}`}
              variant="outlined"
              onClick={() =>
                openModal({
                  title: modalTitle,
                  content: component,
                })
              }
            >
              <span>{label}</span>
              <IconComponent />
            </Button>
          </div>
        );
      })}

      {/* Clear Button */}
      {selectedFilters?.length > 0 && (
        <Button className="text-white font-bold normal-case" variant="contained" color="error" onClick={() => setSelectedFilters([])}>
          Clear All
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
