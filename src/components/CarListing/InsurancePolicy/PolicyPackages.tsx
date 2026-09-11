'use client';
import { VehicleInfoEditProps } from '@/types/car-listing/carListingTypes';
import { HookFormComponentProps } from '@/types/componentTypes';
import { ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import CheckedIcon from '../../../../public/icons/checked.svg';
import SectionHeader from '../SectionHeader';
import { IPolicyPackagesList, policyPackagesList } from './Packages';

import { useCarListingContext } from '@/context/CarListingProvider';
import dayjs from 'dayjs';
import { PiDotOutlineFill } from 'react-icons/pi';
import UncheckedIcon from '../../../../public/icons/unchecked.svg';

const PolicyPackages = ({
  register,
  control,
  watch,
  formState,
  setValue,
  reset,
  getValues,
  trigger,
  setError,
  clearErrors,
  isEdit,
}: HookFormComponentProps & VehicleInfoEditProps) => {
  const { errors } = formState;
  const { carData, listingId } = useCarListingContext();
  const today = dayjs();
  const modificationDate = today.add(2, 'days');
  const formattedDate = modificationDate.format('DD MMMM YYYY');
  // console.log(today);
  // console.log(formattedDate);
  //   console.log(carData?.insurance?.coverageType);
  //   const [view, setView] = useState(policyPackagesList[0]?.id);
  // const [view, setView] = useState(() => {
  //   // const defaultCoverageType = carData?.insurancePolicy?.coverageType;
  //     const defaultCoverageType = carData?.insurancePolicy?.coverageType;
  //   const defaultPackage = policyPackagesList.find((policy) => policy.coverageType === defaultCoverageType);
  //   return defaultPackage?.id || policyPackagesList[0]?.id;
  // });
  // const [view, setView] = useState(() => {
  //   const defaultCoverageType =
  //     carData?.insurancePolicies && carData?.insurancePolicies.length
  //       ? carData.insurancePolicies[carData.insurancePolicies.length - 1]?.coverageType
  //       : policyPackagesList[0]?.coverageType;
  //   const defaultPackage = policyPackagesList.find((policy) => policy.coverageType === defaultCoverageType);
  //   return defaultPackage?.id || policyPackagesList[0]?.id;
  // });
  const [view, setView] = useState(policyPackagesList?.[0]?.id);
  // console.log(view);
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string | null) => {
    setView(nextView || policyPackagesList[0]?.id);
  };
  // useEffect(() => {
  //   const selectedPolicy = policyPackagesList.find((policy) => policy.id === view);
  //   console.log(selectedPolicy);
  //   if (selectedPolicy) {
  //     const { coverageType, coveragePercentage, excessFee } = selectedPolicy;
  //     setValue('insurance.coverageType', coverageType);
  //     setValue('insurance.coveragePercentage', coveragePercentage);
  //     setValue('insurance.excessFee', excessFee);
  //     console.log(coveragePercentage, coverageType, excessFee);
  //   }
  //   // else if (view === 'sixty') {
  //   //   const defaultPackage = policyPackagesList[0];
  //   //   setValue('insurance.coverageType', defaultPackage?.coverageType || 'premium');
  //   //   setValue('insurance.coveragePercentage', defaultPackage?.coveragePercentage || 60);
  //   //   setValue('insurance.excessFee', defaultPackage?.excessFee || 0);
  //   // }
  // }, [policyPackagesList, view]);
  useEffect(() => {
    const getUpdatedPolicy = async () => {
      if (listingId && carData && carData?.insurancePolicies?.length > 0 && carData?.carMarketValue) {
        const { insurancePolicies, carMarketValue } = carData;
        // console.log(insurancePolicies[insurancePolicies.length - 1]?.coverageType);
        // console.log(insurancePolicies[insurancePolicies.length - 1]?.coveragePercentage);
        // console.log(insurancePolicies[insurancePolicies.length - 1]?.excessFee);
        // console.log(carMarketValue);
        setValue('insurance.carMarketValue', carMarketValue);
        setValue('insurance.coverageType', insurancePolicies[insurancePolicies?.length - 1]?.coverageType);
        setValue('insurance.coveragePercentage', insurancePolicies[insurancePolicies?.length - 1]?.coveragePercentage);
        setValue('insurance.excessFee', insurancePolicies[insurancePolicies?.length - 1]?.excessFee);
        setValue('isAgreedCoverage', true, { shouldValidate: true });
        // setView(insurancePolicies[insurancePolicies?.length - 1]?.coverageType);
        const policy = policyPackagesList.find((policy) => policy.coverageType === insurancePolicies[insurancePolicies?.length - 1]?.coverageType);
        if (policy) {
          setView(policy.id);
          // console.log(view);
        }
      }
    };
    getUpdatedPolicy();
  }, [listingId, carData]);

  useEffect(() => {
    // console.log(policyPackagesList);
    // console.log(view);
    const selectedPolicy = policyPackagesList.find((policy) => policy.id === view);
    // console.log(selectedPolicy);
    if (selectedPolicy?.coveragePercentage) {
      const { coverageType, coveragePercentage, excessFee } = selectedPolicy;
      // console.log(coverageType, coveragePercentage, excessFee);
      setValue('insurance.coverageType', coverageType);
      setValue('insurance.coveragePercentage', coveragePercentage, { shouldValidate: true });
      setValue('insurance.excessFee', excessFee);
      // console.log(coveragePercentage, coverageType, excessFee);
    }
  }, [policyPackagesList, view]);
  // console.log(watch('insurance.coverageType'));
  // console.log(watch('insurance.coveragePercentage'));
  // console.log(watch('insurance.excessFee'));
  return (
    <div>
      <SectionHeader
        title="Partner Vehicle Coverage Packages"
        subtitle="Welcome to our Partner Vehicle Coverage Packages, designed to provide you with comprehensive protection and peace of mind for your vehicle. Whether you are a new customer or a long-time partner, this guide will help you navigate through the features and benefits of our coverage packages."
      />
      <div className="w-full ">
        <ToggleButtonGroup fullWidth value={view} exclusive onChange={handleChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policyPackagesList?.map((policy: IPolicyPackagesList) => {
            const { id, name, icon, coveragePercentage, excessFee, dents, tyres, interior } = policy;
            const IconComponent = icon as IconType;
            return (
              <ToggleButton
                style={{ border: view === id ? '1px solid gray' : '' }}
                className={`mb-4 rounded-lg grid grid-cols-12 items-center normal-case bg-white shadow-lg ${
                  view === id ? 'border-2 border-primary' : ''
                } `}
                fullWidth
                key={id}
                value={id}
                aria-label={id}
                // disabled={isEdit}
              >
                <div className="col-span-2 flex justify-center items-start">
                  <IconComponent className="text-6xl" />
                </div>
                <div className="col-span-10 flex flex-col justify-start items-start">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-lg font-semibold m-0">{name}</p>
                    <div className="col-span-1">{view === id ? <CheckedIcon className="text-2xl" /> : <UncheckedIcon className="text-2xl" />}</div>
                  </div>

                  <p className="m-0">
                    Insurance Excess Fee: <span className="font-bold">${excessFee}</span>
                  </p>
                  <p className="m-0">
                    Percentage from Rental Fees: <span className="font-bold">{coveragePercentage}%</span>
                  </p>
                </div>

                <div className="md:col-start-3 col-span-12">
                  {/* <div className="col-span-12"> */}
                  <p className={`text-md font-semibold m-0 flex ${view === id ? 'text-primary' : ''}`}>Fair wear and Tear includes</p>
                  <div className="text-sm m-0 flex">
                    <span className="flex justify-start items-start">
                      <PiDotOutlineFill />
                    </span>
                    <p className="m-0 text-start">
                      <span className="font-semibold">{'Scratches/dents: '}</span>
                      <span>{dents}</span>
                    </p>
                  </div>
                  <div className="text-sm m-0 flex">
                    <span className="flex justify-start items-start">
                      <PiDotOutlineFill />
                    </span>
                    <p className="m-0 text-start">
                      <span className="font-semibold">{'Tyres: '}</span>
                      <span>{tyres}</span>
                    </p>
                  </div>
                  <div className="text-sm m-0 flex">
                    <span className="flex justify-start items-start">
                      <PiDotOutlineFill />
                    </span>
                    <p className="m-0 text-start">
                      <span className="font-semibold">{'Interior: '}</span>
                      <span>{interior}</span>
                    </p>
                  </div>
                </div>
                {/* <div className="col-span-1">
                  {view === id ? (
                    <CommonTextIcon text={`${!isSmallScreen ? 'Selected' : ''}`} startIcon={<CheckedIcon className="text-2xl mr-2" />} />
                  ) : (
                    <CommonTextIcon text={`${!isSmallScreen ? 'Select' : ''}`} startIcon={<UncheckedIcon className="text-2xl mr-2" />} />
                  )}
                </div> */}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </div>
      {isEdit && (
        <>
          <Typography className="my-4 text-justify text-sm text-accent">
            <b>{`N.B:`}</b> {`The modification for the partner vehicle coverage package will be effective from ${formattedDate}`}
          </Typography>
        </>
      )}
    </div>
  );
};

export default PolicyPackages;
