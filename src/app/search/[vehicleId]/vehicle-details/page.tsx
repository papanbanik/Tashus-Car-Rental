import SearchedVehicleDetails from '@/components/Search/SearchedVehicleDetails';
import { TashusTitle } from '@/utils/Functions/randomCommonFn';
import { getVehicleMetadata } from '@/utils/metadata/vehicleMetadata';
import siteMetadata from '@/utils/siteMetadata';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ vehicleId: string }>;
  searchParams: Promise<{ pickup?: string; return?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vehicleId } = await params;

  const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === 'production';

  // In dev — return simple fallback, no OG
  if (!isProduction) {
    return {
      title: `Vehicle Details | ${TashusTitle}`,
    };
  }

  // In production — return full dynamic OG metadata
  const vehicle = getVehicleMetadata(vehicleId);

  if (!vehicle) {
    return {
      title: `Vehicle Details | ${TashusTitle}`,
      openGraph: {
        images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
      },
    };
  }

  return {
    title: `${vehicle.name} | ${TashusTitle}`,
    description: vehicle.description,
    openGraph: {
      title: `${vehicle.name} | ${TashusTitle}`,
      description: vehicle.description,
      images: [{ url: vehicle.image, width: 1200, height: 630, alt: vehicle.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vehicle.name} | ${TashusTitle}`,
      description: vehicle.description,
      images: [vehicle.image],
    },
  };
}

const SearchedCarDetails = () => {
  return (
    <div>
      <SearchedVehicleDetails />
    </div>
  );
};

export default SearchedCarDetails;
