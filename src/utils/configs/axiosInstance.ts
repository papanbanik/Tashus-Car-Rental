import axios, { HeadersDefaults } from 'axios';
import { signOut } from 'next-auth/react';
import { handleDeleteAuthCookies } from '../Functions/auth/cookiesHelper';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_V2;

type headers = {
  'Content-Type': string;
  Accept: string;
  Authorization: string;
  [key: string]: string;
};

const axiosClient = axios.create();

axiosClient.defaults.baseURL = `${apiUrl}`;

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as headers & HeadersDefaults;

// Adding Authorization header for all requests

axiosClient.interceptors.request.use(
  (config) => {
    const { accessToken } = JSON.parse(localStorage.getItem('tashus') || '{}');
    // console.log('tashus', accessToken);

    if (accessToken) {
      // Configure this as per your backend requirements
      config.headers!['Authorization'] = `Bearer ${accessToken}`;
      return config;
    } else {
      // Get the current path and search parameters
      const currentPath = window.location.pathname;
      const searchParams = window.location.search;

      const returnTo = `${currentPath}${searchParams}`;

      // console.log({ currentPath, searchParams });
      // console.log(returnTo);

      // Redirect to the login page with return_url=current-url
      // window.location.href = `/login?return_url=${returnTo}`;
      //Firefox issue
      // window.location.assign(`/login?return_url=${returnTo}`);
      window.location.replace(`/login?return_url=${returnTo}`);
      // location.assign(`/login?return_url=${returnTo}`);
      // if (typeof window !== undefined) {
      //   window.location.href = `/login?return_url=${returnTo}`;
      // }
      // window.onpopstate = function () {
      //   window.history.back();
      // };
      //using agent [It also work]
      // const userAgent = navigator.userAgent;
      // const isFirefox = userAgent.includes('Firefox');
      // const targetUrl = `/login?return_url=${returnTo}`;
      // if (isFirefox) {
      //   window.location.replace(targetUrl);
      // } else {
      //   window.location.href = targetUrl;
      // }

      // Return a rejected promise to prevent the original request
      return Promise.reject('No accessToken');
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axiosClient.interceptors.request.use(
//   (config) => {
//     const { accessToken } = JSON.parse(localStorage.getItem('tashus') || '{}');
//     console.log('tashus', accessToken);
//     if (accessToken) {
//       // Configure this as per your backend requirements
//       config.headers!['Authorization'] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Add a response interceptor to handle 401 errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401 && typeof window !== 'undefined') {
      // Clear the user's session and redirect to the login page
      // console.log('clear session');
      localStorage.removeItem('tashus');
      handleDeleteAuthCookies();
      await signOut({ redirect: false, callbackUrl: '/' });
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// axiosClient.interceptors.response.use(
//   res => {
//     return res;
//   },
//   async err => {
//     const originalConfig = err.config;

//     if (originalConfig.url !== '/user/login' && err.response) {
//       // Access Token was expired
//       if (err.response.status === 401 && !originalConfig._retry) {
//         originalConfig._retry = true;

//         try {
//           const rs = await axios.post(
//             'https://api.example.org/user/refresh',
//             {
//               headers: {
//                 Authorization: localStorage.getItem('refresh-token')!
//               }
//             }
//           );

//           const access = rs.data.data['X-Auth-Token'];
//           const refresh = rs.data.data['X-Refresh-Token'];

//           localStorage.setItem('access-token', access);
//           localStorage.setItem('refresh-token', refresh);

//           return axiosClient(originalConfig);
//         } catch (_error) {
//           // toast.error('Session time out. Please login again.', {
//           //   id: 'sessionTimeOut'
//           // });
//           // Logging out the user by removing all the tokens from local
//           localStorage.removeItem('access-token');
//           localStorage.removeItem('refresh-token');
//           // Redirecting the user to the landing page
//           window.location.href = window.location.origin;
//           return Promise.reject(_error);
//         }
//       }
//     }

//     return Promise.reject(err);
//   }
// );

export default axiosClient;
