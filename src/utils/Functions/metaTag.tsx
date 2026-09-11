function MetaTag() {
  const title = `Tashus | Eco-Friendly Car Rental in Australia`;
  const description = `Tashus: eco-friendly car rental in Australia. Affordable rentals for students and professionals. Sustainable travel made simple.`;
  const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;
  return (
    <>
      {/* <meta name="msvalidate.01" content="2364F9362E4AAA95B12CDD631FDAC2DC" /> */}
      <title>Tashus | Eco-Friendly Car Rental in Australia</title>
      {/* <!-- Facebook Open Graph --> */}
      <meta property="og:title" content="Tashus | Eco-Friendly Car Rental in Australia" />
      <meta
        property="og:description"
        content="Tashus: eco-friendly car rental in Australia. Affordable rentals for students and professionals. Sustainable travel made simple."
      />
      <meta property="og:image" content="/icons/tashus-512x512.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content="https://www.facebook.com/134854959713161" />
      <meta property="og:site_name" content="Tashus" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />

      {/* <!-- Twitter Cards --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tashus_carshare" />
      <meta name="twitter:creator" content="@tashus_carshare" />
      <meta name="twitter:title" content="Tashus: eco-friendly car rental in Australia." />
      <meta
        name="twitter:description"
        content="Tashus: eco-friendly car rental in Australia. Affordable rentals for students and professionals. Sustainable travel made simple."
      />
      <meta name="twitter:image" content="/icons/tashus-512x512.png" />

      {/* <!-- General Meta Tags --> */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Tashus" />
      <meta name="title" content="Tashus: eco-friendly car rental in Australia." />
      <meta
        name="description"
        content="Tashus: eco-friendly car rental in Australia. Affordable rentals for students and professionals. Sustainable travel made simple."
      />
    </>
  );
}
MetaTag.propTypes = {};

MetaTag.defaultProps = {};

export default MetaTag;
