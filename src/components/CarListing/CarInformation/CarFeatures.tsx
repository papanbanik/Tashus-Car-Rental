'use client';

import React, { useEffect } from 'react';
import ButtonPrevNext from '../../Common/ButtonPrevNext';
import { useCarListingContext } from '@/context/CarListingProvider';
import { Button, Container, Typography } from '@mui/material';
import CommonForm from '@/components/Common/CommonForm';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { CarFeaturesValues } from '@/types/car-listing/carListingTypes';
import MultiSelection from '@/components/Common/HookFormFields/MultiSelection';
import RichEditor from '@/components/Common/HookFormFields/RichEditor';
import DisplayRichText from '@/components/Common/DisplayRichText';
import DynamicField from '@/components/Common/HookFormFields/DynamicField';
// import { useAddCarFeatures } from '@/hooks/useCarListing';
import SectionHeader from '../SectionHeader';
import { HookFormComponentProps } from '@/types/componentTypes';
import CheckBox from '@/components/Common/HookFormFields/CheckBox';
import { featureList } from '@/utils/Lists/carListInfo';

const CarFeatures = ({ register, control, watch, formState }: HookFormComponentProps) => {
  const { errors } = formState;

  return (
    <div>
      <SectionHeader title="Features"></SectionHeader>

      <div className="listing_section_content lg:px-0 px-2">
        <MultiSelection control={control} registerName="features" required={true} options={featureList}></MultiSelection>
        {/* <MultiSelection control={control} registerName="features" required={true} disabled={!listingId}></MultiSelection> */}
      </div>

      <DynamicField
        control={control}
        registerName="additionalFeatures"
        register={register}
        dynamicObjFieldName="feature"
        label="Additional Feature"
        maxLength={{
          value: 50,
          message: 'Please write within 50 characters',
        }}
        watch={watch}
        allErrors={errors?.additionalFeatures as FieldErrors | undefined}
        // disabled={!listingId}
      ></DynamicField>

      <SectionHeader title="A brief description of your vehicle"></SectionHeader>
      <div className="listing_section_content text-left">
        <RichEditor
          control={control}
          registerName="additionalInfos.carDescription"
          label="Description of your vehicle. . ."
          required={true}
          errors={errors?.additionalInfos?.carDescription}
          // disabled={!listingId}
        ></RichEditor>
      </div>

      <SectionHeader title="Vehicle Guide"></SectionHeader>
      <div className="listing_section_content text-left">
        <RichEditor
          control={control}
          registerName="additionalInfos.guidelines"
          label="Guidelines to follow for guests. . ."
          required={true}
          errors={errors?.additionalInfos?.guidelines}
        ></RichEditor>
      </div>
      {/* <DisplayRichText content={watch('additionalInfos.carDescription')}></DisplayRichText> */}

      <SectionHeader title="Vehicle Obligations"></SectionHeader>
      <div className="p-0 listing_section_content w-full">
        <div className="md:col-span-6 col-span-12 p-0">
          <CheckBox
            control={control}
            registerName="vehicleObligations.neverWrittenOff"
            label="This vehicle was never written off"
            required={true}
          ></CheckBox>
        </div>

        <div className="md:col-span-6 col-span-12 p-0">
          <CheckBox
            control={control}
            registerName="vehicleObligations.ctpInsurance"
            label="CTP insurance is informed that I am sharing this vehicle"
            required={true}
          ></CheckBox>
        </div>
      </div>
    </div>
  );
};

export default CarFeatures;
