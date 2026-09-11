//Profile
export const profileHelpingPictures = [
  '/Images/Guest-Verification/profileSample/profileSample1.svg',
  '/Images/Guest-Verification/profileSample/profileSample2.svg',
  '/Images/Guest-Verification/profileSample/profileSample3.svg',
];

export const profileHelpingDescriptions = [
  'You should be facing forward',
  'Frame your head and shoulders',
  'You should be centered upright',
  'Your face and eye should be visible',
  'You should be only person in the photo',
  'Use a color photo with high resolution',
  'Avoid logos and contact information',
];

export const profileHelpingData = [
  {
    title: 'What Your Photo Needs',
    pictures: profileHelpingPictures,
    descriptions: profileHelpingDescriptions,
  },
  // {
  //   title: 'Verify Email',
  //   descriptions:
  //     'Verifying your email is an important security step. If you did not receive the verification email, please check your spam/junk folders.',
  // },
  // Add more data as needed
];

//license
export const licenseFrontHelpingPictures = [
  '/Images/Guest-Verification/licenseSample/licenseFront1.svg',
  '/Images/Guest-Verification/licenseSample/licenseFront2.svg',
];
export const licenseBackHelpingPictures = [
  '/Images/Guest-Verification/licenseSample/licenseBack1.svg',
  '/Images/Guest-Verification/licenseSample/licenseBack2.svg',
];
export const licenseFrontHelpingDescriptions = [
  `Ensure the entire front of the driver’s license is visible.`,
  'Avoid using flash to prevent reflections.',
];
export const licenseBackHelpingDescriptions = [
  `Ensure the entire back of the driver’s license is visible.`,
  'Use a well-lit area to avoid shadows and glare.',
];
export const licenseHelpingData = [
  {
    title: 'What License Front Needs',
    pictures: licenseFrontHelpingPictures,
    descriptions: licenseFrontHelpingDescriptions,
  },
  {
    title: 'What License Back Needs',
    pictures: licenseBackHelpingPictures,
    descriptions: licenseBackHelpingDescriptions,
  },
];

//License Details
export const licenseDetailsHelpingDescriptions = [
  `You must have to provide Driver's License information to reserve a vehicle.`,
  `Double-check all details to ensure they match your driver’s license.`,
  'Use the correct date format to avoid errors.',
  'Ensure the information is legible and accurately entered to prevent delays in verification.',
];
export const licenseDetailsHelpingData = [
  {
    title: 'What License Details Needs',
    pictures: [],
    descriptions: licenseDetailsHelpingDescriptions,
  },
];

//Selfie with License
export const licenseSelfieHelpingPictures = [
  '/Images/Guest-Verification/licenseSample/licenseSelfie1.svg',
  '/Images/Guest-Verification/licenseSample/licenseSelfie2.svg',
  '/Images/Guest-Verification/licenseSample/licenseSelfie3.svg',
];
export const licenseSelfieHelpingDescriptions = [
  'Ensure your face is fully visible.',
  'Hold the front of your license next to your face; all details must be legible.',
  'Use good lighting to avoid shadows and glare.',
  'Ensure the image is clear and not blurry.',
  'Use a plain background.',
  'Accepted file formats: JPEG, JPG, and PNG.',
];
export const licenseSelfieHelpingData = [
  {
    title: 'What License Selfie Needs',
    pictures: licenseSelfieHelpingPictures,
    descriptions: licenseSelfieHelpingDescriptions,
  },
];

//Secondary ID Details
export const secondaryIDHelpingPictures = [
  '/Images/Guest-Verification/secondaryIDSample/passport1.jpg',
  '/Images/Guest-Verification/secondaryIDSample/passport2.jpeg',
];
export const secondaryIDDetailsHelpingDescriptions = [
  'Double-check all details for accuracy against your ID.',
  'Use DD/MM/YYYY format for expiry date.',
  'Select the correct country from the dropdown.',
  'Review all information before submitting.',
];
export const secondaryIDHelpingDescriptions = [
  'Ensure the entire ID is visible.',
  'Use good lighting to avoid shadows and glare.',
  'Ensure the image is clear and in focus.',
  'Use a plain background.',
  'Accepted file formats: JPEG, JPG, and PNG.',
];
export const secondaryIDHelpingData = [
  {
    title: 'What Your Secondary ID Needs',
    pictures: [],
    descriptions: secondaryIDDetailsHelpingDescriptions,
  },
  {
    title: 'What Your Photo Needs',
    pictures: secondaryIDHelpingPictures,
    descriptions: secondaryIDHelpingDescriptions,
  },
];

//Address
export const addressProofHelpingPictures = [
  '/Images/Guest-Verification/addressSample/address1.svg',
  '/Images/Guest-Verification/addressSample/address2.svg',
  // '/Images/Guest-Verification/addressSample/address3.svg',
];
export const addressProofHelpingDescriptions = [
  'Upload a clear, high-quality image of a document as proof of your current address.',
  'Ensure the document is dated within the last three months.',
  'Ensure your name, address, and document details are clearly visible.',
  'Accepted file formats: JPEG, JPG, and PNG.',
];
export const addressHelpingDescriptions = [
  'Ensure you include every part of the address, such as the  country, unit number, street number, postal code, suburb and state',
  'Ensure to Provide Postal Address',
  'Use search option that supports auto-complete, to minimize the risk of errors and speed up the process.',
  'Always review your address one last time before submitting the form to catch any overlooked errors.',
];
export const addressHelpingData = [
  {
    title: 'What Your Address Needs',
    pictures: [],
    descriptions: addressHelpingDescriptions,
  },
  {
    title: 'What Your Photo Needs',
    pictures: addressProofHelpingPictures,
    descriptions: addressProofHelpingDescriptions,
  },
];
