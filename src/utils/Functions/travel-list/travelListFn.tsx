import { TSingleTravel } from '@/types/travels/typeEditTravels';
import dayjs from 'dayjs';

export type TTravelGroup = {
  groupName: string;
  groupDataList: TSingleTravel[];
  timestamp: number;
};
// Function to group and sort the data
export const groupAndSortDataOld = (dataList: TSingleTravel[]) => {
  let tempGroupDataList: any = [];

  dataList.forEach((travelData) => {
    const monthYear = dayjs(travelData?.pickupDate).format('MMMM YYYY');

    // Check if a group with the same groupName already exists
    const existingGroup = tempGroupDataList?.find((group: any) => group.groupName === monthYear);

    if (existingGroup) {
      existingGroup.groupDataList.push(travelData);
    } else {
      // Create a new group
      tempGroupDataList.push({
        groupName: monthYear,
        groupDataList: [travelData],
        timestamp: dayjs(travelData.pickupDate).valueOf(), // Adding a timestamp for sorting
      });
    }
  });

  // Sort the groups by timestamp (from latest to oldest)
  tempGroupDataList = tempGroupDataList.sort((a: any, b: any) => b.timestamp - a.timestamp);
  // **Sort the groupDataList within each group in ascending order by pickupDate**
  tempGroupDataList.forEach((group: any) => {
    group.groupDataList = group.groupDataList.sort(
      (a: TSingleTravel, b: TSingleTravel) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime()
    );
  });
  return tempGroupDataList;
};

// Function to sort groups
const sortGroups = (groups: TTravelGroup[], criteria?: string, isUpcoming?: boolean) => {
  switch (criteria) {
    case 'ascTime':
      return groups.sort((a, b) => a.timestamp - b.timestamp);
    case 'descTime':
      return groups.sort((a, b) => b.timestamp - a.timestamp);
    case 'ascReservationId':
      return groups.sort((a, b) => {
        const minA = Math.min(...a.groupDataList.map((item: TSingleTravel) => item.reservationId));
        const minB = Math.min(...b.groupDataList.map((item: TSingleTravel) => item.reservationId));
        return minA - minB;
      });
    case 'descReservationId':
      return groups.sort((a, b) => {
        const maxA = Math.max(...a.groupDataList.map((item: TSingleTravel) => item.reservationId));
        const maxB = Math.max(...b.groupDataList.map((item: TSingleTravel) => item.reservationId));
        return maxB - maxA;
      });
    default:
      return isUpcoming ? groups.sort((a, b) => a.timestamp - b.timestamp) : groups.sort((a, b) => b.timestamp - a.timestamp); // Default to latest to oldest
  }
};

// Function to sort items within a group
const sortItems = (items: TSingleTravel[], criteria?: string, isPast?: boolean) => {
  switch (criteria) {
    case 'ascTime':
      return items.sort((a, b) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime());
    case 'descTime':
      return items.sort((a, b) => new Date(b.pickupDate).getTime() - new Date(a.pickupDate).getTime());
    case 'ascReservationId':
      return items.sort((a, b) => a.reservationId - b.reservationId);
    case 'descReservationId':
      return items.sort((a, b) => b.reservationId - a.reservationId);
    default:
      return isPast
        ? items.sort((a, b) => new Date(b.pickupDate).getTime() - new Date(a.pickupDate).getTime())
        : items.sort((a, b) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime());
  }
};

// Function to group and sort the data
export const groupAndSortData = (dataList: TSingleTravel[], externalSortCriteria?: string, isPast?: boolean, isUpcoming?: boolean) => {
  const groupMap = new Map<string, TTravelGroup>();
  // Grouping data by month-year
  dataList?.forEach((travelData) => {
    if (!travelData?.pickupDate) return;
    const monthYear = dayjs(travelData?.pickupDate).format('MMMM YYYY');
    const timestamp = dayjs(travelData?.pickupDate).valueOf();
    if (groupMap.has(monthYear)) {
      groupMap.get(monthYear)?.groupDataList?.push(travelData);
    } else {
      groupMap.set(monthYear, {
        groupName: monthYear,
        groupDataList: [travelData],
        timestamp,
      });
    }
  });
  // Convert map to array
  let tempGroupDataList = Array.from(groupMap.values());
  // Apply sorting
  tempGroupDataList = sortGroups(tempGroupDataList, externalSortCriteria, isUpcoming);
  tempGroupDataList.forEach((group) => {
    group.groupDataList = sortItems(group.groupDataList, externalSortCriteria, isPast);
  });

  return tempGroupDataList;
};
