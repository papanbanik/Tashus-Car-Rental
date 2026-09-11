import { useState, useEffect } from 'react';
import { FaCar, FaTint, FaKey, FaExclamationTriangle, FaTrashAlt, FaSprayCan, FaDollarSign, FaTools, FaClock } from 'react-icons/fa';

type FeeItem = {
  item: string;
  cost: string;
  remarks: string;
};

type FeeCategory = {
  category: string;
  icon: JSX.Element | null;
  items: FeeItem[];
};

const useFeesData = () => {
  const [sortedFeesData, setSortedFeesData] = useState<FeeCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeesData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/setting/get-all-fee/feeList`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const apiResponse = await response.json();
        const apiData = Array.isArray(apiResponse) ? apiResponse : apiResponse.data;

        if (!Array.isArray(apiData)) {
          throw new Error('Invalid API data format: Expected an array');
        }

        const groupedData: { [key: string]: FeeItem[] } = {};

        apiData.forEach((item: any) => {
          const { category, itemName, baseCost, additionalCostList, maxFee, remarks, itemKey } = item;

          // Determine the cost value based on the conditions
          let totalCost =
            itemKey === 'lateReturn' || itemKey === 'lateReturnDays'
              ? `${item?.helpingText} + ${additionalCostList.join(' + ')}`
              : maxFee
              ? `Maximum $${maxFee}`
              : category === 'Cancellations' && !baseCost && additionalCostList.length === 0
              ? 'As per cancellation policy'
              : baseCost
              ? `$${baseCost}${additionalCostList.length ? ` + ${additionalCostList.join(' + ')}` : ''}`
              : additionalCostList.length
              ? `${additionalCostList.join(' + ')}`
              : 'Actual Cost';

          const feeItem: FeeItem = {
            item: itemName,
            cost: totalCost,
            remarks: remarks,
          };

          if (!groupedData[category]) {
            groupedData[category] = [];
          }
          groupedData[category].push(feeItem);
        });

        const sortedCategories = Object.keys(groupedData).sort();
        const sortedData = sortedCategories.map((category) => ({
          category,
          icon: getCategoryIcon(category),
          items: groupedData[category],
        }));

        setSortedFeesData(sortedData);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchFeesData();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Traffic & Parking':
        return <FaCar />;
      case 'Fuel & Cleanliness':
        return <FaTint />;
      case 'Keys & Accessories':
        return <FaKey />;
      case 'Damage & Misuse':
        return <FaExclamationTriangle />;
      case 'Cancellations':
        return <FaTrashAlt />;
      case 'Cleanliness':
        return <FaSprayCan />;
      case 'Other Issues':
        return <FaTools />;
      case 'Overdue Return':
        return <FaClock />;
      case 'Vehicle Use':
        return <FaDollarSign />;
      default:
        return null;
    }
  };

  return { sortedFeesData, loading, error };
};

export default useFeesData;
