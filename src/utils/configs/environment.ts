const environment = {
  port: process.env.PORT || 8000,
  DOMAIN: process.env.NEXT_PUBLIC_NODE_ENV === 'preview' ? 'https://pre-testing-tashus.vercel.app' : process.env.NEXT_PUBLIC_DOMAIN ?? '',
  API_URL: process.env.NEXT_PUBLIC_API_URL,
};

export default environment;
