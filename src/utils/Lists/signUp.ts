import { brandImages } from '../imageImport';

export const signUpMethods = [
  {
    id: 'google',
    name: 'Google',
    logoSrc: `${brandImages.google}`,
    redirectUrl: '/',
  },
  // {
  //   id: 'facebook',
  //   name: 'Facebook',
  //   logoSrc: `${brandImages.facebook}`,
  //   redirectUrl: 'path_to_facebook_login_page',
  // },
  {
    id: 'email',
    name: 'Email',
    logoSrc: `${brandImages.email}`,
    redirectUrl: 'path_to_email_login_page',
  },
  // {
  //   id: 'phone',
  //   name: 'Phone',
  //   logoSrc: `${brandImages.phone}`,
  //   redirectUrl: 'path_to_phone_login_page',
  // },
  // {
  //   id: 'apple',
  //   name: 'Apple',
  //   logoSrc: `${brandImages.apple}`,
  //   redirectUrl: 'path_to_apple_login_page',
  // },
];
