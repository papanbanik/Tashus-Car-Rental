'use client';
import dayjs from 'dayjs';

export const isReviewExpired = (createdAt: Date) => {
  if (createdAt) {
    const createdDate = dayjs(createdAt);
    const currentDate = dayjs();
    const expirationDate = createdDate.add(15, 'days');
    return currentDate.isAfter(expirationDate);
  }
  return false;
};

export const isReviewEditExpired = (createdAt: Date) => {
  if (createdAt) {
    const createdDate = dayjs(createdAt);
    const currentDate = dayjs();
    const expirationDate = createdDate.add(15, 'days');
    return currentDate.isAfter(expirationDate);
  }
  return false;
};

export const calculateRemainingTime = (createdDate: Date, daysToAdd?: number) => {
  const currentDate = dayjs();
  const expirationDate = dayjs(createdDate).add(daysToAdd ?? 15, 'days');
  if (currentDate.isBefore(expirationDate)) {
    const remainingDays = expirationDate.diff(currentDate, 'days');
    const remainingHours = expirationDate.diff(currentDate, 'hours');
    const daysMessage = `${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
    const hoursMessage = `${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
    return {
      remainingDays,
      remainingHours,
      daysMessage,
      hoursMessage,
      expirationDate,
    };
  }
  return null;
};

export const reviewExpiredAlert = "The review time has expired. You can't add a review now";

export const reviewEditExpiredAlert = "The review modification time has expired. You can't modify the review now";
