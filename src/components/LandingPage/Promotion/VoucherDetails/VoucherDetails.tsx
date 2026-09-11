'use client';
import CommonBreadCrumb from '@/components/Common/Breadcrumbs/CommonBreadCrumb';
import { Card, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import promotionPageDefaultImage from '../../../../../public/Images/LandingpagePopupImage/promotion.webp';
import VoucherOfferTable from './VoucherOfferTable';
import VoucherTermsAndCondition from './VoucherTermsAndCondition';
import MoreVoucherOffersSection from './MoreVoucherOffersSection';
import { useParams } from 'next/navigation';
import { useGetSingleVoucherDetails } from '@/hooks/promotion-page/useGetSingleVoucherDetails';
import VoucherSkeleton from './VoucherDetailsSkeleton';
import { useGetLoginUserVouchers } from '@/hooks/promotion-page/useGetLoginUserVouchers';
import { useUserCredContext } from '@/context/UserCredProvider';
import { TTashusLocalStorage } from '@/types/voucher-promotion/promotionTypes';
import { useGetCommonVouchers } from '@/hooks/promotion-page/useGetCommonVouchers';

const VoucherDetails = () => {
  const { voucherSlug } = useParams<{ voucherSlug: string }>();
  const { data, isLoading } = useGetSingleVoucherDetails({ voucherSlug });
  const { data: commonVouchers } = useGetCommonVouchers();
  const { mutateAsync: getVouchers } = useGetLoginUserVouchers();
  const { userProfileInfo } = useUserCredContext();
  const [loginUserVouchers, setLoginUserVouchers] = useState([]);
  const [tashus, setTashus] = useState<TTashusLocalStorage>({});
  const voucherList = tashus?.userId ? loginUserVouchers : commonVouchers?.data ?? [];
  const [userId, setUserId] = useState<string | null>(null);

  const sortedData = voucherList?.sort(
    (a: { promotion: { updatedAt: string | number | Date } }, b: { promotion: { updatedAt: string | number | Date } }) =>
      new Date(b.promotion?.updatedAt).getTime() - new Date(a.promotion?.updatedAt).getTime()
  );
  const filteredMoreVoucherList = tashus?.userId ? sortedData : sortedData?.slice(0, 3);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localTashus = JSON.parse(localStorage.getItem('tashus') || '{}');
      setTashus(localTashus);
    }
  }, [userProfileInfo]);

  useEffect(() => {
    setUserId(tashus?.userId ?? null);
  }, [tashus?.userId]);

  useEffect(() => {
    if (userId && Object.keys(userProfileInfo).length !== 0) {
      const completedTravels = userProfileInfo?.guestTotalTrips;
      const emailVerified = userProfileInfo?.verificationInfo?.email?.isVerified;
      const firstTravel = userProfileInfo?.guestTotalTrips > 0 ? false : true;

      const fetchVouchers = async () => {
        try {
          const data = await getVouchers({ completedTravels, emailVerified, firstTravel, userId });
          if (data) {
            setLoginUserVouchers(data?.data);
          }
        } catch (error) {
          console.log('Error fetching vouchers:', error);
        }
      };

      fetchVouchers();
    }
  }, [getVouchers, userId, userProfileInfo]);

  const reservationBreadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Promotions', href: '/promotion' }, { label: `${voucherSlug}` }];
  return (
    <div className="pt-8">
      {isLoading ? (
        <VoucherSkeleton />
      ) : (
        <>
          <div className="mb-4 ">
            <CommonBreadCrumb items={reservationBreadcrumbItems} />
          </div>
          <div>
            <Typography className={`font-semibold md:text-4xl text-lg  }`}>{data?.data?.responseObject?.voucherTitle ?? ''}</Typography>
          </div>
          <Card className="my-4">
            <div>
              <Image
                src={
                  data?.data?.responseObject?.voucherImages?.length > 0
                    ? data?.data?.responseObject?.voucherImages[0].secure_url
                    : promotionPageDefaultImage
                }
                alt="Unlock Exclusive Discounts with Tashus Vouchers"
                width={1920}
                height={500}
                className="w-full h-[100px] sm:h-[200px] max-h-[200px] object-fill"
              />
            </div>
            <div className="my-4 mx-4">
              <VoucherOfferTable voucherDetails={data?.data?.responseObject} />
            </div>
            <div className="mt-4 mb-12 mx-4">
              <VoucherTermsAndCondition voucherDetails={data?.data?.responseObject} />
            </div>
          </Card>
          <div className="mb-8 mt-16">
            <MoreVoucherOffersSection filteredMoreVoucherList={filteredMoreVoucherList} />
          </div>
        </>
      )}
    </div>
  );
};
export default VoucherDetails;
