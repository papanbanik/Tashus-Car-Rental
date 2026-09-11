import { TGuestVerificationFlags } from '@/context/SearchProvider';
import { TVerificationFieldFlags } from '@/types/profileInfoTypes';
import { IMapSearchResidential, TAddressInfo, UserProfileVerificationInfo } from '@/types/user-verification/userVerificationTypes';
import dayjs from 'dayjs';
import { UseFormSetValue } from 'react-hook-form';
import { currentDateTime, isDrivingAgeValid, isLicenseExpired } from '../dateTimeCommonFn';
import { countryFullName, stateFullName } from '../randomCommonFn';

export const getFormattedIdType = (idType: string) => {
  switch (idType) {
    case 'NationalId':
      return 'National ID';
    case 'StudentId':
      return 'Student ID';
    case 'PassportId':
      return 'Passport ID';
    case 'Other':
      return 'Other';
    default:
      return idType;
  }
};

export const minAge = 21;
export const maxAge = 75;
export const disableDatesForDOB = (date: any) => {
  const diffYears = currentDateTime.diff(dayjs(date), 'year');
  const invalid = diffYears < minAge || diffYears > maxAge;
  return dayjs(date).isSame(currentDateTime, 'day') || invalid;
};

// Restricting dates not in range 21-75
export const validateDateOfBirth = (selectedDate: any) => {
  // if (!selectedDate) {
  //   return true;
  // }
  return (dayjs(selectedDate).isBefore(currentDateTime) && !disableDatesForDOB(selectedDate)) || 'Age needs to be between 21 to 75 years';
};

export const extractStreetInfo = (completeAddress: string, country: string, region: string) => {
  const firstPart = completeAddress.split(',')[0]?.trim() || '';

  const addressRegex = /^(\d+)\s+(.*)$/;
  const match = firstPart.match(addressRegex);
  if (firstPart === country || firstPart === region) {
    return { streetNumber: '', streetName: '' };
  }
  if (match) {
    const streetNumber = match[1];
    const streetName = match[2];
    return { streetNumber, streetName };
  } else {
    return { streetNumber: '', streetName: firstPart };
  }
};

export const extractStreetNumberAndName = (streetAddressName: string) => {
  let streetNumber = '';
  let streetName = streetAddressName?.trim();

  const parts = streetAddressName?.split(' ');

  if (parts && parts[0].match(/\d/)) {
    streetNumber = parts[0];
    streetName = parts.slice(1).join(' ').trim();
    return { streetNumber, streetName };
  }
  return { streetNumber, streetName };
};

export const DVerificationFieldFlags = {
  isProfileIncorrect: false,
  isDLInfoIncorrect: false, //DL represent Driving License
  isDLPhotoIncorrect: false,
  isDLBackPhotoIncorrect: false,
  isDLSelfieIncorrect: false,
  isSecondaryIdIncorrect: false,
  isSecondaryIdPhotoIncorrect: false,
  isAddressIncorrect: false,
};

export function getDiscrepancyMessage(verificationFieldFlags: TVerificationFieldFlags, dynamicName: string): string {
  // Field labels with dynamic secondary ID
  const fieldLabels: { [key in keyof TVerificationFieldFlags]: string } = {
    isProfileIncorrect: 'profile photo',
    isDLInfoIncorrect: 'license info',
    isDLPhotoIncorrect: 'license front photo',
    isDLBackPhotoIncorrect: 'license back photo',
    isDLSelfieIncorrect: 'selfie with license',
    isSecondaryIdIncorrect: `${dynamicName} ID Info`,
    isSecondaryIdPhotoIncorrect: `${dynamicName} ID photo`,
    isAddressIncorrect: 'address',
  };

  // Get the list of incorrect fields
  const incorrectFields = Object.entries(verificationFieldFlags)
    .filter(([_, value]) => value)
    .map(([key]) => fieldLabels[key as keyof TVerificationFieldFlags]);
  if (incorrectFields.length === 0) {
    return '';
  } else if (incorrectFields.length === 1) {
    return `There is a discrepancy with your ${incorrectFields[0]}. Please review and provide the correct information.`;
  } else {
    const formattedFields =
      incorrectFields.length === 2 ? incorrectFields.join(' and ') : `${incorrectFields.slice(0, -1).join(', ')} and ${incorrectFields.slice(-1)}`;
    return `There are discrepancies with your ${formattedFields}. Please review and provide the correct information.`;
  }
}

export const maxOtpAttempts = 3;

// Function to calculate the remaining time based on OTP attempt
export const calculateOTPRemainingTime = (otpVerifyAttempt: number, lastOtpRequest: string): number => {
  if (!lastOtpRequest) {
    return 0; // No OTP request found, so no interval
  }

  const lastRequestDate = dayjs(lastOtpRequest);
  const currentTime = dayjs();
  const timeDifference = currentTime.diff(lastRequestDate, 'second'); // Difference in seconds

  let totalTime = 0;

  // Set appropriate interval based on the OTP request attempt
  // if (otpVerifyAttempt === 1) {
  //   totalTime = 60; // 1 minute for the first attempt
  // } else if (otpVerifyAttempt === 2) {
  //   totalTime = 180; // 3 minutes for the second attempt
  // } else if (otpVerifyAttempt === 3) {
  //   totalTime = 300; // 5 minutes for the third attempt
  // } else if (otpVerifyAttempt === 4) {
  //   totalTime = 600; // 10 minutes for subsequent attempts
  // }
  if (otpVerifyAttempt >= maxOtpAttempts) {
    totalTime = 600; // 10 minutes after max
  } else {
    totalTime = 60; // 1 minute for each attempt
  }

  // Calculate and return the remaining time
  return timeDifference <= totalTime ? totalTime - timeDifference : 0;
};

export const streetTypeTable: Record<string, string> = {
  //testing purpose
  // hotel: 'HOTL',
  // tourism: 'TOUR',
  // college: 'CLG',
  // A type
  Access: 'ACCS',
  Alley: 'ALLY',
  Alleyway: 'ALWY',
  Amble: 'AMBL',
  Anchorage: 'ANCG',
  Approach: 'APP',
  Arcade: 'ARC',
  Artery: 'ART',
  Avenue: 'AVE',

  // B type
  Basin: 'BASN',
  Beach: 'BCH',
  Bend: 'BEND',
  Block: 'BLK',
  Boulevard: 'BVD',
  Brace: 'BRCE',
  Brae: 'BRAE',
  Break: 'BRK',
  Bridge: 'BDGE',
  Broadway: 'BDWY',
  Brow: 'BROW',
  Bypass: 'BYPA',
  Byway: 'BYWY',

  // C type
  Causeway: 'CAUS',
  Centre: 'CTR',
  Centreway: 'CNWY',
  Chase: 'CH',
  Circle: 'CIR',
  Circlet: 'CLT',
  Circuit: 'CCT',
  Circus: 'CRCS',
  Close: 'CL',
  Colonnade: 'CLDE',
  Common: 'CMMN',
  Concourse: 'CON',
  Copse: 'CPS',
  Corner: 'CNR',
  Court: 'CT',
  Courtyard: 'CTYD',
  Cove: 'COVE',
  Crescent: 'CRES',
  Cross: 'CRSS',
  Crossing: 'CRSG',
  Crossroad: 'CRD',
  Cruiseway: 'CUWY',
  Cutting: 'CTTG',

  // D type
  Dale: 'DALE',
  Dell: 'DELL',
  Deviation: 'DEVN',
  Dip: 'DIP',
  Distributor: 'DSTR',
  Drive: 'DR',
  Driveway: 'DRWY',

  // E type
  Edge: 'EDGE',
  Elbow: 'ELB',
  End: 'END',
  Entrance: 'ENT',
  Esplanade: 'ESP',
  Estate: 'EST',
  Expressway: 'EXTN',

  // F type
  Fairway: 'FAWY',
  FireTrack: 'FTRK',
  FireTrail: 'FITR',
  Flat: 'FLAT',
  Follow: 'FOLW',
  Footway: 'FTWY',
  Formation: 'FORM',
  Front: 'FRNT',
  Frontage: 'FRTG',
  Foreshore: 'FSHR',

  // G type
  Gap: 'GAP',
  Garden: 'GDN',
  Gardens: 'GDNS',
  Gate: 'GTE',
  Gates: 'GTES',
  Glade: 'GLD',
  Glen: 'GLEN',
  Green: 'GRN',
  Ground: 'GRND',
  Grove: 'GR',
  Gully: 'GLY',

  // H type
  Heights: 'HTS',
  Highroad: 'HRD',
  Highway: 'HWY',
  Hill: 'HILL',

  // I type
  Interchange: 'INTG',
  Intersection: 'INTN',

  // J type
  Junction: 'JNC',

  // K type
  Key: 'KEY',

  // L type
  Landing: 'LDG',
  Lane: 'LNE',
  Laneway: 'LNWY',
  Lees: 'LEES',
  Line: 'LNE',
  Link: 'LINK',
  Little: 'LT',
  Loop: 'LOOP',
  Lookout: 'LKT',
  Lower: 'LWR',

  // M type
  Mall: 'MALL',
  Meander: 'MNDR',
  Mew: 'MEW',
  Mews: 'MEWS',
  Motorway: 'MWY',
  Mount: 'MT',

  // N type
  Nook: 'NOOK',

  // O type
  Outlook: 'OTLK',

  // P type
  Parade: 'PDE',
  Park: 'PARK',
  Parklands: 'PKLD',
  Parkway: 'PKWY',
  Pass: 'PASS',
  Path: 'PATH',
  Pathway: 'PHWY',
  Piazza: 'PIAZ',
  Place: 'PL',
  Plateau: 'PLAT',
  Plaza: 'PLZA',
  Pocket: 'PKT',
  Point: 'PNT',
  Port: 'PORT',
  Promenade: 'PROM',
  Quad: 'QUAD',
  Quadrant: 'QDRT',
  Quay: 'QY',
  Quays: 'QYS',

  // R type
  Ramble: 'RMBL',
  Range: 'RNGE',
  Reach: 'RCH',
  Reserve: 'RES',
  Rest: 'REST',
  Retreat: 'RTT',
  Ridge: 'RDGE',
  Ridgeway: 'RGWY',
  Ring: 'RING',
  River: 'RVR',
  Riviera: 'RVRA',
  Road: 'RD',
  Roads: 'RDS',
  Roadside: 'RDSD',
  Roadway: 'RDWY',
  Rotary: 'RTY',
  Round: 'RND',
  Route: 'RTE',
  Row: 'ROW',
  Rue: 'RUE',
  Run: 'RUN',

  // S type
  ServiceWay: 'SWY',
  Siding: 'SDNG',
  Slope: 'SLPE',
  Sound: 'SND',
  Spur: 'SPUR',
  Square: 'SQ',
  Stairs: 'STRS',
  StateHighway: 'SHWY',
  Steps: 'STPS',
  Strand: 'STRA',
  Street: 'ST',
  Strip: 'STRP',
  Subway: 'SBWY',

  // T type
  Tam: 'TARN',
  Terrace: 'TCE',
  Thoroughfare: 'THOR',
  Tollway: 'TLWY',
  Top: 'TOP',
  Tor: 'TOR',
  Towers: 'TWRS',
  Track: 'TRK',
  Trail: 'TRL',
  Trailer: 'TRLR',
  Triangle: 'TRI',
  Trunkway: 'TKY',
  Turn: 'TURN',

  // U type
  Underpass: 'UPAS',
  Upper: 'UPR',

  // V type
  Vale: 'VALE',
  Viaduct: 'VDCT',
  View: 'VIEW',
  Villas: 'VLLS',
  Vista: 'VSTA',

  // W type
  Wade: 'WADE',
  Walk: 'WALK',
  Walkway: 'WKWY',
  Way: 'WAY',
  Wharf: 'WHRF',
  Wynd: 'WYND',

  // Y type
  Yard: 'YARD',
};

//Address step
export const compareAddressFields = (addressInfo: TAddressInfo, prefix: string, watch: (field: string) => any) => {
  const { streetName, streetNumber, country, state, suburb, postcode, streetAddress, unitNumber } = addressInfo || {};
  const unitNumberChanged = unitNumber ? unitNumber !== watch(`${prefix}.unitNumber`) : !!watch(`${prefix}.unitNumber`);
  return (
    country !== watch(`${prefix}.country`) ||
    state !== watch(`${prefix}.state`) ||
    suburb !== watch(`${prefix}.suburb`) ||
    postcode !== watch(`${prefix}.postcode`) ||
    streetNumber !== watch(`${prefix}.streetNumber`) ||
    unitNumberChanged ||
    streetName !== watch(`${prefix}.streetName`) ||
    streetAddress !== watch(`${prefix}.streetAddress`)
  );
};

export const getRequestVerificationMessages = (userProfileVerificationInfo: UserProfileVerificationInfo) => {
  const profileInfo = userProfileVerificationInfo?.profileInfo;
  const guestVerification = userProfileVerificationInfo?.guestVerification;
  const verificationFieldFlags = guestVerification?.requestVerificationInfo?.verificationInfoFlags ?? DVerificationFieldFlags;
  const isCountryAustralia = guestVerification?.drivingLicenseInfo?.country === 'Australia';
  //addressMessage
  const addressMessage =
    guestVerification?.residentialAddress?.status !== 'resubmitted' &&
    guestVerification?.requestVerificationInfo?.verificationInfoFlags?.isAddressIncorrect
      ? 'Please update your address info to meet the platform guidelines.'
      : '';
  //licenseMessages
  const licensePhotoMessage =
    guestVerification?.drivingLicensePhoto?.status !== 'resubmitted' &&
    guestVerification?.drivingLicensePhotoBackside?.status !== 'resubmitted' &&
    verificationFieldFlags?.isDLPhotoIncorrect &&
    verificationFieldFlags?.isDLBackPhotoIncorrect
      ? 'Please upload both the front and back photos of your license to comply with the platform guidelines.'
      : guestVerification?.drivingLicensePhoto?.status !== 'resubmitted' && verificationFieldFlags?.isDLPhotoIncorrect
      ? 'Please update your license front photo to meet the platform guidelines.'
      : guestVerification?.drivingLicensePhotoBackside?.status !== 'resubmitted' && verificationFieldFlags?.isDLBackPhotoIncorrect
      ? 'Please update your license back photo to meet the platform guidelines.'
      : '';

  const licenseInfoMessage =
    guestVerification?.drivingLicenseInfo?.status !== 'resubmitted' && verificationFieldFlags?.isDLInfoIncorrect
      ? 'Please update your license info to meet the platform guidelines.'
      : '';

  const licenseSelfieMessage =
    guestVerification?.drivingLicenseWithFace?.status !== 'resubmitted' && verificationFieldFlags?.isDLSelfieIncorrect
      ? 'Please update your selfie with license to meet the platform guidelines.'
      : '';

  const secondaryIDMessage =
    guestVerification?.secondaryIdInfo?.status !== 'resubmitted' &&
    (verificationFieldFlags?.isSecondaryIdIncorrect || verificationFieldFlags?.isSecondaryIdPhotoIncorrect)
      ? `Please update your ${!isCountryAustralia ? 'passport' : 'secondary'} info to meet the platform guidelines.`
      : '';

  //profileMessage
  const profileMessage =
    profileInfo?.picture?.status !== 'resubmitted' && verificationFieldFlags?.isProfileIncorrect
      ? 'Please update your profile photo to meet the platform guidelines.'
      : '';

  return {
    addressMessage,
    licenseMessage: {
      licensePhotoMessage,
      licenseInfoMessage,
      licenseSelfieMessage,
      secondaryIDMessage,
    },
    profileMessage,
    secondaryIDMessage,
  };
};

//Dynamically set full address
export const getFullAddress = (
  unitNumber?: string,
  streetNumber?: string,
  streetName?: string,
  suburb?: string,
  stateName?: string,
  postcode?: string,
  countryName?: string
): string => {
  const addressParts = [
    unitNumber ? `Unit ${unitNumber},` : '',
    streetNumber || '',
    streetName || '',
    suburb ? `${suburb},` : '',
    stateName ? `${stateFullName(stateName, countryName)},` : '',
    postcode || '',
    countryName ? countryFullName(countryName) : '',
  ];
  return addressParts.filter(Boolean).join(' ');
};

//for Address Match
export const extractAddressFields = (address: TAddressInfo) => ({
  unitNumber: address?.unitNumber ?? '',
  streetNumber: address?.streetNumber ?? '',
  streetName: address?.streetName ?? '',
  suburb: address?.suburb ?? '',
  state: address?.state ?? '',
  postcode: address?.postcode ?? '',
  country: address?.country ?? '',
  streetAddress: address?.streetAddress ?? '',
  streetType: address?.streetType ?? '',
});

//Address Set Values from Search
export const setFormValues = (
  formValues: IMapSearchResidential,
  fieldPrefix: string,
  setValue: (field: string, value: any, options?: { shouldValidate?: boolean }) => void
) => {
  let streetNumber = '';
  let streetName = formValues?.address || '';

  if (!!streetName) {
    const streetInfo = extractStreetNumberAndName(streetName);
    streetNumber = streetInfo?.streetNumber ?? '';
    streetName = streetInfo?.streetName ?? '';
  } else if (!streetName && formValues?.complete_address) {
    const streetInfo = extractStreetInfo(formValues?.complete_address, formValues?.country?.text, formValues?.region?.text);
    streetNumber = streetInfo?.streetNumber ?? '';
    streetName = streetInfo?.streetName ?? '';
  }

  // Dynamically set the values for either australianAddressInfo or postalAddressInfo
  setValue(`${fieldPrefix}.streetNumber`, streetNumber, { shouldValidate: true });
  setValue(`${fieldPrefix}.streetName`, streetName, { shouldValidate: true });
  setValue(`${fieldPrefix}.postcode`, formValues?.postcode?.text || '', { shouldValidate: !!formValues?.postcode?.text });

  let convertRegion = formValues?.region?.short_code || '';
  convertRegion = convertRegion.split('-').pop() || '';
  setValue(`${fieldPrefix}.state`, convertRegion, { shouldValidate: true });

  setValue(`${fieldPrefix}.city`, formValues?.place?.text || '', { shouldValidate: !!formValues?.place?.text });

  const convertedCountryShortCode = formValues?.country?.short_code?.toUpperCase() || '';
  setValue(`${fieldPrefix}.country`, convertedCountryShortCode);

  setValue(`${fieldPrefix}.suburb`, formValues?.locality?.text || '', { shouldValidate: !!formValues?.locality?.text });
  setValue(`${fieldPrefix}.streetAddress`, formValues?.complete_address || '', { shouldValidate: !!formValues?.complete_address });
  setValue(`${fieldPrefix}.streetType`, formValues?.streetType || '', { shouldValidate: !!formValues?.streetType });
  setValue(`${fieldPrefix}.unitNumber`, '', { shouldValidate: true });
};

//watch fields common
export const useWatchedAddressFields = (fieldPrefix: string, watch: (field: string) => any) => {
  const streetName = watch(`${fieldPrefix}.streetName`);
  const countryName = watch(`${fieldPrefix}.country`);
  const stateName = watch(`${fieldPrefix}.state`);
  const streetNumber = watch(`${fieldPrefix}.streetNumber`);
  const unitNumber = watch(`${fieldPrefix}.unitNumber`);
  const suburb = watch(`${fieldPrefix}.suburb`);
  const postcode = watch(`${fieldPrefix}.postCode`);
  return {
    streetName,
    countryName,
    stateName,
    streetNumber,
    unitNumber,
    suburb,
    postcode,
  };
};

//Set Address Values from db values
export const setAddressValues = (prefix: string, addressInfo: TAddressInfo | undefined, setValue: UseFormSetValue<any>) => {
  if (!addressInfo) return;
  const fields: (keyof TAddressInfo)[] = ['country', 'state', 'suburb', 'postcode', 'unitNumber', 'streetNumber', 'streetName', 'streetAddress'];
  fields.forEach((field) => {
    const fieldValue = addressInfo[field];
    if (fieldValue !== undefined) {
      setValue(`${prefix}.${field}`, fieldValue, { shouldValidate: true });
    }
  });
};

//Postal Info valid check
export const isValidPostalAddressInfo = (info: TAddressInfo | undefined) => {
  return (
    info?.country?.trim() ||
    info?.postcode?.trim() ||
    info?.state?.trim() ||
    info?.streetAddress?.trim() ||
    info?.streetName?.trim() ||
    info?.streetNumber?.trim() ||
    info?.suburb?.trim() ||
    info?.unitNumber?.trim()
  );
};

export const getVerificationFlags = (userProfileVerificationInfo: UserProfileVerificationInfo): TGuestVerificationFlags => {
  const profileInfo = userProfileVerificationInfo?.profileInfo;
  const guestVerification = userProfileVerificationInfo?.guestVerification;
  const mandatoryFields = guestVerification?.mandatoryFields;
  let isExpired = false;
  if (guestVerification?.drivingLicenseInfo?.expiryDate) {
    isExpired = isLicenseExpired(guestVerification?.drivingLicenseInfo?.expiryDate);
  }
  let isAgeValid = false;
  if (profileInfo?.dateOfBirth) {
    isAgeValid = isDrivingAgeValid(profileInfo?.dateOfBirth);
  }
  let isSecondaryIDExpired = false;
  if (guestVerification?.secondaryIdInfo?.expiryDate) {
    isSecondaryIDExpired = isLicenseExpired(guestVerification?.secondaryIdInfo?.expiryDate);
  }
  const licenseCountryAus = guestVerification?.drivingLicenseInfo?.country ? guestVerification?.drivingLicenseInfo?.country === 'Australia' : true;
  //check photo
  const photoCheck = mandatoryFields?.isProfilePhotoRequired ? !!profileInfo?.picture?.imageInfo?.secure_url : true;
  //check secondary id
  //  const secondaryIdCheckRequired = !licenseCountryAus || mandatoryFields?.isSecondaryIdRequired;
  const secondaryIdCheckRequired = true;
  const secondaryIdCheck = secondaryIdCheckRequired ? !!guestVerification?.secondaryIdInfo?.idType : true;
  //check aus. address
  const australianAddressRequired = !licenseCountryAus || mandatoryFields?.isAustralianAddressRequired;
  const australianAddressCheck = australianAddressRequired ? !!guestVerification?.residentialAddress?.australianAddressInfo?.country : true;
  //check proof of address
  const proofOfAddressRequired = !licenseCountryAus || mandatoryFields?.isProofOfAddressRequired;
  const proofOfAddressCheck = proofOfAddressRequired ? !!guestVerification?.residentialAddress?.proofOfAddressPhoto?.imageInfo?.secure_url : true;

  let verificationFlags: TGuestVerificationFlags = {
    isEmailVerified: profileInfo?.verificationInfo?.email?.isVerified ?? false,
    isMobileVerified: profileInfo?.verificationInfo?.phone?.isVerified ?? false,
    isAddressVerified: !!guestVerification?.residentialAddress?.residentialAddressInfo?.country && australianAddressCheck && proofOfAddressCheck,
    isLicenseVerified: !!guestVerification?.drivingLicenseInfo && !isExpired && isAgeValid,
    isProfilePhotoVerified: photoCheck,
    isLicenseFaceVerified: !!guestVerification?.drivingLicenseWithFace?.imageInfo?.secure_url,
    isLicensePhotoVerified: !!guestVerification?.drivingLicensePhoto?.imageInfo?.secure_url,
    isSecondaryIDVerified: secondaryIdCheck && (!!guestVerification?.secondaryIdInfo?.expiryDate ? !isSecondaryIDExpired : true),
  };

  return verificationFlags;
};

export const getVerificationState = (guestVerificationFlags: TGuestVerificationFlags, finalVerificationStatus?: string) => {
  const verificationStepComplete = Object.values(guestVerificationFlags).every((value) => value === true);
  const finalStatusApproved = !!finalVerificationStatus ? finalVerificationStatus === 'approved' : false;

  const verificationApproved = verificationStepComplete && finalStatusApproved;

  return { verificationStepComplete, verificationApproved };
};
