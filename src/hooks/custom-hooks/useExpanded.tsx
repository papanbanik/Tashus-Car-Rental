import { useState } from 'react';

const useExpanded = (initialState: boolean = false) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialState);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return [isExpanded, toggleExpand] as const;
};

export default useExpanded;
