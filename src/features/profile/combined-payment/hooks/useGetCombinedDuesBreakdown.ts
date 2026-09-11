'use client';

import environment from '@/utils/configs/environment';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DueBreakdownSchema, type CombinedDuesData } from '../types/combined-payment.types';

const fetchCombinedDuesBreakdown = async (reservationId: number): Promise<CombinedDuesData | null> => {
  const { accessToken } = JSON.parse(localStorage.getItem('tashus') || '{}');
  if (!accessToken || !reservationId) return null;

  const response = await axios.get(`${environment?.API_URL}/v3/profile/combined-payments/${reservationId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const rawBreakdown = response.data?.responseObject?.outStandingDuesBreakdown;
  const totalOutstandingDues = response.data?.responseObject?.totalOutstandingDues ?? 0;

  if (!rawBreakdown) return null;

  const parsed = DueBreakdownSchema.safeParse(rawBreakdown);
  if (!parsed.success) {
    console.warn('Invalid dues breakdown shape:', parsed.error);
    return null;
  }

  return {
    totalOutstandingDues,
    outStandingDuesBreakdown: parsed.data,
  };
};

export const useGetCombinedDuesBreakdown = (reservationId: number) => {
  return useQuery<CombinedDuesData | null>({
    queryKey: ['combinedDuesBreakdown', reservationId],
    queryFn: () => fetchCombinedDuesBreakdown(reservationId),
    enabled: !!reservationId,
  });
};
