import axios from 'axios';
import NextAuth, { Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    error: '/error', //if any google login error occurs, it redirects to this page (CommonPublicError component)
  },
  callbacks: {
    async session({ session }) {
      // console.log('session route', session);

      const response = await axios.get(`${apiUrl}/auth/checkUser`, {
        params: {
          email: session?.user?.email,
        },
      });

      // console.log(response);
      // console.log(response?.data);

      // store the user id from MongoDB to session
      // const updatedSession = {
      //   ...session
      // };
      const updatedSession = {
        ...session,
        user: {
          ...(session.user || {}),
          userId: response?.data?.userId,
          accessToken: response?.data?.accessToken,
        },
      };

      return updatedSession;
    },

    // any is used to solve the error Property 'picture' does not exist on type 'Profile'.""
    async signIn({ account, profile, user, credentials }: any): Promise<any> {
      try {
        // console.log(account);
        // console.log('pro', profile);
        // console.log('user', user);
        // console.log('credentials', credentials);

        if (account.provider === 'google') {
          const { email, email_verified, picture, family_name, given_name } = profile;

          const response = await axios.post(`${apiUrl}/auth/google-signin`, {
            signInMethod: 'google',
            email,
            firstName: given_name,
            lastName: family_name,
            profilePic: picture,
            googleInfo: account,
          });
          // console.log(response);

          return true;
        }

        if (account.provider === 'facebook') {
          console.log('fb');
          // const { email, email_verified, picture, family_name, given_name } = profile;

          // const response = await axios.post(`${apiUrl}/auth/google-signin`, {
          //   signInMethod: 'google',
          //   email,
          //   firstName: given_name,
          //   lastName: family_name,
          //   profilePic: picture,
          //   googleInfo: account,
          // });
          // console.log(response);

          return true;
        }

        return false;
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Error login with google';
        console.log('Error checking if user exists: ', errorMessage.replace(/ /g, '_'));
        const sanitizedMessage = errorMessage.replace(/ /g, '_');
        const encodedMessage = encodeURIComponent(sanitizedMessage);
        throw new Error(`${encodedMessage}&type=google-login-error`); //if any google login error occurs, throw error here
      }
    },
  },
});

export { handler as GET, handler as POST };
