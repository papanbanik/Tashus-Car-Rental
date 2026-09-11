"use client";

import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/configs/axiosInstance";

import { OutstandingDuesResponse } from "../types/outstanding-dues.type";

export function useFetchOutstandingDues(userId: string | undefined) {
  return useQuery<OutstandingDuesResponse, Error>({
    queryKey: ["outstandingDues", userId],
    queryFn: () => fetchOutstandingDues(userId!),
    enabled: !!userId,
  });
}

export async function fetchOutstandingDues(userId: string): Promise<OutstandingDuesResponse> {
  try {
    const response = await axiosClient.get(`/v3/profile/outstanding-dues/${userId}`);
    const responseData = response?.data?.responseObject || response?.data;
    
    return {
      totalOutstandingDues: responseData?.totalOutstandingDues || responseData?.TotalOutstandingDues || 0,
      outstandingDuesList: responseData?.outstandingDuesList || [],
    };
  } catch (error) {
    console.error("useFetchOutstandingDues error", error);
    throw error;
  }
}
