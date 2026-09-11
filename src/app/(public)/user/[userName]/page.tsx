import PublicProfile from '@/components/PublicProfile/PublicProfile';
import siteMetadata from '@/utils/siteMetadata';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string; userName: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  // read route params
  const userName = params['userName'];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const product = await fetch(`${apiUrl}/other/public/profile/${userName}`).then((res) => res.json());
  const DOMAIN = `${process.env.NEXT_PUBLIC_DOMAIN}`;
  // console.log('product', product);
  const title = product?.data[0]?.fullName;
  const profileTitle = ` ${title} | Tashus Car Rental`;
  const descriptionText = product?.data[0]?.profileSummary?.partner || product?.data[0]?.profileSummary?.guest;
  // console.log(descriptionText);
  const description = descriptionText ? descriptionText.substring(0, 200) : '';

  // console.log(title);
  const canonicalUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/user/${userName}`;

  return {
    title: profileTitle,

    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: './',
      title: profileTitle,
      description: description,
      siteName: siteMetadata.title,
      images: [product?.data[0]?.picture?.imageInfo?.secure_url ?? siteMetadata.socialBanner],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function Page({ params, searchParams }: Props) {
  return (
    <div>
      <PublicProfile />
    </div>
  );
}
