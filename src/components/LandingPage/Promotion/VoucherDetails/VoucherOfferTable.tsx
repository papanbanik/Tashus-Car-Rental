'use client';
import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { TVoucher } from '@/types/voucher-promotion/promotionTypes';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { TVoucherRule } from '../PromotionType';

interface VoucherDetailsProps {
  voucherDetails: TVoucher;
}

export default function VoucherOfferTable({ voucherDetails }: VoucherDetailsProps) {
  const [copiedVoucherId, setCopiedVoucherId] = useState<string | null>(null);
  const handleCopy = (voucherId: string) => {
    setCopiedVoucherId(voucherId);
    setTimeout(() => setCopiedVoucherId(null), 2000);
  };

  return (
    <div className="overflow-x-auto">
      <Table
        aria-label="voucher offers table"
        sx={{
          minWidth: 650,
          '& .MuiTableCell-root': {
            border: '1px solid rgba(224, 224, 224, 1)',
            padding: { xs: '8px', sm: '16px' },
            fontSize: { xs: '0.875rem', sm: '1rem' },
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center" className="text-base font-bold">
              Offer
            </TableCell>
            <TableCell align="center" className="text-base font-bold">
              Campaign Period
            </TableCell>
            <TableCell align="center" className="text-base font-bold">
              Voucher Code
            </TableCell>
            <TableCell align="center" className="text-base font-bold">
              Applicable Users
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row" align="center">
              <Typography variant="body2" textAlign="center">
                {/* {voucherDetails?.discountType === 'flat'
                  ? (() => {
                      const discountOverDaysRule = voucherDetails?.voucherRules?.find((rule: any) => rule?.field === 'discountOverDays');

                      if (discountOverDaysRule) {
                        const days = discountOverDaysRule.value;
                        const discountAmount = voucherDetails?.discountAmount;

                        return `Enjoy first ${days > 1 ? `${days}` : ''} ${days === 1 ? 'day' : 'days'} ${
                          discountAmount > 0 ? `for just $${discountAmount}` : 'for free!'
                        }`;
                      } else {
                        return `Pay only $${voucherDetails?.discountAmount ?? 0}`;
                      }
                    })()
                  : voucherDetails?.discountType === 'free_days'
                  ? (() => {
                      const discountFreeDays = voucherDetails?.voucherRules?.find((rule: any) => rule?.field === 'freeDays');

                      if (discountFreeDays) {
                        const days = Number(discountFreeDays.value);

                        return `Enjoy first ${days > 1 ? `${days}` : ''} ${days === 1 ? 'day' : 'days'} for free!`;
                      }

                      return '';
                    })()
                  : `Get ${
                      voucherDetails?.discountType === 'percentage'
                        ? `${voucherDetails?.discountAmount ?? 0}%`
                        : `$${voucherDetails?.discountAmount ?? 0}`
                    } OFF`} */}

                {voucherDetails?.discountType === 'flat'
                  ? (() => {
                      const discountOverDaysRule = voucherDetails?.voucherRules?.find((rule: TVoucherRule) => rule.field === 'discountOverDays');

                      if (discountOverDaysRule) {
                        const days = Number(discountOverDaysRule.value); // Convert string to number
                        const discountAmount = voucherDetails?.discountAmount;

                        return `Enjoy first ${days > 1 ? `${days}` : ''} ${days === 1 ? 'day' : 'days'} ${
                          discountAmount > 0 ? `for just $${discountAmount}` : 'for free!'
                        }`;
                      } else {
                        return `Pay only $${voucherDetails?.discountAmount ?? 0}`;
                      }
                    })()
                  : voucherDetails?.discountType === 'free_days'
                  ? (() => {
                      const discountFreeDays = voucherDetails?.voucherRules?.find((rule: TVoucherRule) => rule.field === 'freeDays');

                      if (discountFreeDays) {
                        const days = Number(discountFreeDays.value);

                        return `Enjoy first ${days > 1 ? `${days}` : ''} ${days === 1 ? 'day' : 'days'} for free!`;
                      }

                      return '';
                    })()
                  : voucherDetails?.discountType === 'percentage'
                  ? (() => {
                      const specificDaysRules =
                        voucherDetails?.voucherRules?.filter((rule: TVoucherRule) => rule.field === 'specificReservationDays') || [];

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

                      return `Get ${voucherDetails?.discountAmount ?? 0}% OFF*`;
                    })()
                  : `Get $${voucherDetails?.discountAmount ?? 0} OFF*`}
              </Typography>
            </TableCell>

            <TableCell align="center">
              <Typography variant="body2">
                {voucherDetails?.activateAt || voucherDetails?.createdAt
                  ? dayjs(voucherDetails?.activateAt || voucherDetails?.createdAt).format('DD MMMM YYYY')
                  : 'N/A'}{' '}
                - {voucherDetails?.expiresAt ? dayjs(voucherDetails?.expiresAt).format('DD MMMM YYYY') : 'N/A'}
              </Typography>
            </TableCell>
            <TableCell align="center" className="flex items-center justify-center min-h-[72px]">
              <Typography variant="body2">{voucherDetails?.voucherCode ?? ''}</Typography>

              {copiedVoucherId === voucherDetails?._id ? (
                <Typography variant="h6" component="div" className=" text-sm sm:text-xs text-center md:text-center text-success ms-1">
                  Copied
                </Typography>
              ) : (
                <div className="flex items-center justify-center ps-2 pe-3">
                  <CopyToClipboard text={voucherDetails?.voucherCode ?? ''} onCopy={() => handleCopy(voucherDetails?._id)}>
                    <span className="ml-2 text-center md:text-end  text-sm cursor-pointer text-primary hover:first-letter">
                      <FaCopy className="text-sm pt-0.5" />
                    </span>
                  </CopyToClipboard>
                </div>
              )}
            </TableCell>
            <TableCell align="center">
              <Typography variant="body2">{voucherDetails?.applicableUserDescription ?? ''}</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
