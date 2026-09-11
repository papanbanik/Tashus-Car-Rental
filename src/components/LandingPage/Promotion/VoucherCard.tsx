'use client';

import Image from 'next/image';
import { Button, CardActions, Skeleton, Theme, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Grid, Card, CardContent } from '@mui/material';
import { useGetCommonVouchers } from '@/hooks/promotion-page/useGetCommonVouchers';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useGetLoginUserVouchers } from '@/hooks/promotion-page/useGetLoginUserVouchers';
import { FaCopy, FaTag } from 'react-icons/fa';
import { TTashusLocalStorage } from '@/types/voucher-promotion/promotionTypes';
import VoucherRules from './VoucherRules';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Link from 'next/link';
import VoucherUsagesCriteria from './VoucherUsagesCriteria';
import './Slider.css';
import dayjs from 'dayjs';
import { useGetAllCommentsOfATicketContext } from '@/context/AllCommentsOfATicketProvider';
import { IoIosArrowForward } from 'react-icons/io';
import { TVoucherRule } from './PromotionType';

const VoucherCard = () => {
  const { data, isLoading } = useGetCommonVouchers();
  const { mutateAsync: getVouchers } = useGetLoginUserVouchers();
  const { setActiveVoucherList } = useGetAllCommentsOfATicketContext();
  const { userProfileInfo } = useUserCredContext();
  const [loginUserVouchers, setLoginUserVouchers] = useState([]);
  const [tashus, setTashus] = useState<TTashusLocalStorage>({});
  const voucherList = tashus?.userId ? loginUserVouchers : data?.data ?? [];
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [copiedVoucherId, setCopiedVoucherId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string | null>(null);

  const numVisibleCars = isSmallScreen ? 3 : 5;

  const sortedData = voucherList?.sort(
    (a: { promotion: { updatedAt: string | number | Date } }, b: { promotion: { updatedAt: string | number | Date } }) =>
      new Date(b.promotion?.updatedAt).getTime() - new Date(a.promotion?.updatedAt).getTime()
  );
  const filteredVoucherList = tashus?.userId ? sortedData : sortedData?.slice(0, 3);

  useEffect(() => {
    if (filteredVoucherList?.length > 0) {
      setActiveVoucherList(filteredVoucherList);
    }
  }, [voucherList]);

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

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: filteredVoucherList.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, filteredVoucherList.length),
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, filteredVoucherList.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleCopy = (voucherId: string) => {
    setCopiedVoucherId(voucherId);
    setTimeout(() => setCopiedVoucherId(null), 2000);
  };

  const toggleCodeVisibility = (voucherId: string) => {
    setSelectedVoucherCode(voucherId);
    setIsCodeVisible(!isCodeVisible);
  };

  return (
    <>
      {isLoading ? (
        <>
          <Grid container spacing={2} style={{ padding: '25px' }}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item} style={{ marginTop: '10px' }}>
                <Skeleton variant="rectangular" width="100%" height={300} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <>
          <Slider {...sliderSettings}>
            {filteredVoucherList?.map((item: any) => (
              <div key={item?.id} className="p-2">
                <Card className="min-h-[384px] max-h-[384px] flex flex-col justify-center">
                  {item?.voucherSlug !== undefined && item?.voucherSlug ? (
                    <Link href={`/promotion/${item.voucherSlug}`} className="no-underline">
                      <CardContent className=" flex flex-col justify-center items-center  mx-0 sm:mx-0 bg-white rounded-md">
                        <div className="w-[120px] flex-shrink-0 lg:ml-2">
                          <Image alt="Coupon Image" width={200} height={180} src={'/Images/CouponImage/coupon.svg'} className="w-full h-auto" />
                        </div>

                        <div className="w-full h-[190px]">
                          <Typography className="text-primary text-center lg:mt-2 mb-0">
                            <span>
                              <span className="font-bold italic text-[22px]">
                                {item?.discountType === 'flat'
                                  ? (() => {
                                      const discountOverDaysRule = item?.voucherRules?.find(
                                        (rule: TVoucherRule) => rule.field === 'discountOverDays'
                                      );

                                      if (discountOverDaysRule) {
                                        const days = Number(discountOverDaysRule.value); // Convert string to number
                                        const discountAmount = item?.discountAmount;

                                        return `Enjoy first ${days > 1 ? `${days}` : ''} ${days === 1 ? 'day' : 'days'} ${
                                          discountAmount > 0 ? `for just $${discountAmount}` : 'for free!'
                                        }`;
                                      } else {
                                        return `Pay only $${item?.discountAmount ?? 0}`;
                                      }
                                    })()
                                  : item?.discountType === 'free_days'
                                  ? (() => {
                                      const discountFreeDays = item?.voucherRules?.find((rule: TVoucherRule) => rule.field === 'freeDays');

                                      if (discountFreeDays) {
                                        const days = Number(discountFreeDays.value);

                                        return `Enjoy first ${days > 1 ? `${days}` : ''} ${days === 1 ? 'day' : 'days'} for free!`;
                                      }

                                      return '';
                                    })()
                                  : item?.discountType === 'percentage'
                                  ? (() => {
                                      const specificDaysRules =
                                        item?.voucherRules?.filter((rule: TVoucherRule) => rule.field === 'specificReservationDays') || [];

                                      if (specificDaysRules.length > 1) {
                                        const secondValues = specificDaysRules
                                          .map((rule: TVoucherRule) => {
                                            const values = (rule.value as string).split(',');
                                            return values.length > 1 && !isNaN(parseInt(values[1])) ? parseInt(values[1]) : null;
                                          })
                                          .filter((value: number | null): value is number => value !== null);

                                        if (secondValues.length > 1) {
                                          const minValue = Math.min(...secondValues);
                                          const maxValue = Math.max(...secondValues);
                                          return `Get ${minValue}% to ${maxValue}% OFF`;
                                        }
                                      }

                                      return `Get ${item?.discountAmount ?? 0}% OFF*`;
                                    })()
                                  : `Get $${item?.discountAmount ?? 0} OFF*`}
                              </span>
                            </span>
                          </Typography>
                          <Typography variant="body2" className="text-center ms-0 md:ms-3 mt-2 lg:mt-4 mb-0 lg:mb-2">
                            <div className="flex justify-center">
                              <div className="text-center">
                                <div>
                                  <span className=" text-center sm:text-sm">
                                    <VoucherRules rules={item?.voucherRules || []} />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Typography>
                        </div>
                      </CardContent>
                    </Link>
                  ) : (
                    <CardContent className=" flex flex-col justify-center items-center  mx-0 sm:mx-0 bg-white rounded-md">
                      <div className="w-[120px] flex-shrink-0 lg:ml-2">
                        <Image alt="Coupon Image" width={200} height={180} src={'/Images/CouponImage/coupon.svg'} className="w-full h-auto" />
                      </div>

                      <div className="w-full h-[190px]">
                        <Typography className="text-primary text-center lg:mt-2 mb-0">
                          <span>
                            <span className="font-bold italic text-[22px]">
                              {item?.discountType === 'flat'
                                ? (() => {
                                    const discountOverDaysRule = item?.voucherRules?.find((rule: any) => rule?.field === 'discountOverDays');

                                    if (discountOverDaysRule) {
                                      const days = discountOverDaysRule.value;
                                      const discountAmount = item?.discountAmount;

                                      return `Enjoy first ${days > 1 ? `${days}` : ''} ${days === 1 ? 'day' : 'days'} ${
                                        discountAmount > 0 ? `for just $${discountAmount}` : 'for free!'
                                      }`;
                                    } else {
                                      return `Pay only $${item?.discountAmount ?? 0}`;
                                    }
                                  })()
                                : item?.discountType === 'free_days'
                                ? (() => {
                                    const discountFreeDays = item?.voucherRules?.find((rule: any) => rule?.field === 'freeDays');

                                    if (discountFreeDays) {
                                      const days = Number(discountFreeDays.value);

                                      return `Enjoy first ${days > 1 ? `${days}` : ''} ${days === 1 ? 'day' : 'days'} for free!`;
                                    }

                                    return '';
                                  })()
                                : `Get ${
                                    item?.discountType === 'percentage' ? `${item?.discountAmount ?? 0}%` : `$${item?.discountAmount ?? 0}`
                                  } OFF*`}
                            </span>
                          </span>
                        </Typography>
                        <Typography variant="body2" className="text-center ms-0 md:ms-3 mt-2 lg:mt-4 mb-0 lg:mb-2">
                          <div className="flex justify-center">
                            <div className="text-center">
                              <div>
                                <span className=" text-center sm:text-sm">
                                  <VoucherRules rules={item?.voucherRules || []} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Typography>
                      </div>
                    </CardContent>
                  )}

                  {item?.discountType === 'percentage' && (
                    <Typography variant="body2" className=" text-sm sm:text-xs text-center md:text-start ps-5">
                      *Max Discount Amount <span>${item?.maxDiscountAmount}</span>
                    </Typography>
                  )}

                  <CardActions className=" mb-2 ms-0 md:ms-4 me-0 md:me-4 pt-0">
                    <Grid container spacing={1} display="flex" justifyContent="space-between" alignItems="center" style={{ textWrap: 'balance' }}>
                      <Grid item xs={12} md={5}>
                        <Typography variant="h6" component="div" className="text-center md:text-start text-sm py-[4px]">
                          Exp: <span className="text-sm sm:text-xs"> {dayjs(item?.expiresAt).format('DD MMM YYYY')}</span>
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={7}>
                        {item.voucherSlug !== undefined && item?.voucherSlug ? (
                          <Link href={`/promotion/${item.voucherSlug}`} className="no-underline">
                            <div className="flex items-center justify-center md:justify-end ">
                              <Typography
                                variant="h6"
                                component="div"
                                className=" text-sm  sm:text-end  py-[4px] px-[8px] cursor-pointer flex items-center"
                              >
                                Explore <IoIosArrowForward />
                              </Typography>
                            </div>
                          </Link>
                        ) : (
                          <>
                            <>
                              {selectedVoucherCode === item?._id ? (
                                <>
                                  {copiedVoucherId === item?._id ? (
                                    <Typography
                                      variant="h6"
                                      component="div"
                                      className=" text-sm sm:text-xs text-center md:text-end text-success py-[4px]"
                                    >
                                      Copied
                                    </Typography>
                                  ) : (
                                    <div className="flex items-center justify-center md:justify-end  py-[4px]">
                                      <Typography variant="h6" component="div" className="text-sm">
                                        <span className="text-sm sm:text-xs">{item?.voucherCode ?? ''}</span>
                                      </Typography>

                                      <CopyToClipboard text={item?.voucherCode ?? ''} onCopy={() => handleCopy(item?._id)}>
                                        <span className="ml-2 text-center md:text-end  text-sm cursor-pointer text-primary hover:first-letter">
                                          <FaCopy className="text-sm pt-0.5" />
                                        </span>
                                      </CopyToClipboard>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="flex items-center justify-center md:justify-end ">
                                  <Typography
                                    variant="h6"
                                    component="div"
                                    className=" text-sm sm:text-xs sm:text-end  text-primary bg-[#F5E4F8] py-[4px] px-[8px] cursor-pointer flex items-center"
                                    onClick={() => toggleCodeVisibility(item?._id)}
                                  >
                                    <FaTag className="text-sm sm:text-xs mr-2" />
                                    Code
                                  </Typography>
                                </div>
                              )}
                            </>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </div>
            ))}
          </Slider>
          {!userId && filteredVoucherList?.length > 0 && (
            <Typography variant="body1" className=" text-black text-center md:text-end text-sm mt-14 md:mt-0 ">
              Login to view more vouchers
              <Link href={'/login'}>
                <Button>Login</Button>
              </Link>
            </Typography>
          )}
        </>
      )}

      <>
        <VoucherUsagesCriteria />
      </>
    </>
  );
};
export default VoucherCard;
