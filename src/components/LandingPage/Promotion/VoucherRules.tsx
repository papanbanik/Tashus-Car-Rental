import React from 'react';
import { TLabelMapping } from '@/types/voucher-promotion/promotionTypes';
import { FaDollarSign, FaCar, FaClipboardCheck, FaCalendarAlt, FaLock } from 'react-icons/fa';
import { formatToDayMonth } from '@/utils/Functions/dateTimeCommonFn';
import { List, ListItem } from '@mui/material';

const iconMapping: TLabelMapping = {
  minimumSpendAmount: { label: 'Spend', icon: <FaDollarSign /> },
  specificCarType: { label: 'Choose a ', icon: <FaCar /> },
  travelsCompleted: { label: 'Completed ', icon: <FaClipboardCheck />, label2: 'Travel' },
  specificReservationDays: { label: 'Book for ', icon: <FaCalendarAlt />, label2: 'Day' },
  monthOfTravel: { label: 'Travel in ', icon: <FaCalendarAlt /> },
  firstTravel: { label: 'First Travel', icon: <FaClipboardCheck /> },
  emailVerified: { label: 'Email Verified', icon: <FaLock /> },
  travelDate: { label: 'Book on ', icon: <FaClipboardCheck /> },
  travelDateRange: { label: 'Book ', icon: <FaCalendarAlt /> },
};

type VoucherRule = {
  field: keyof typeof iconMapping;
  value: any;
  operator: string;
};

type VoucherRulesProps = {
  rules: VoucherRule[];
  isDetails?: boolean;
};

const operatorTextMapping: Record<string, string> = {
  '=': '',
  '!=': 'not equal to',
  '<': 'less than',
  '>': 'more than',
  '<=': 'not more than',
  '>=': 'at least',
  between: 'between',
};

// Function to generate display text for each rule
const getDisplayText = (rule: VoucherRule, specificDaysCount: number) => {
  const { label, label2 } = iconMapping[rule.field] || { label: '', icon: null };
  const operatorText = operatorTextMapping[rule.operator] || '';

  // Handle specificReservationDays with multiple rules
  if (rule.field === 'specificReservationDays' && specificDaysCount > 1) {
    const values = (rule.value as string).split(',');
    if (values.length === 2 && !isNaN(parseInt(values[0])) && !isNaN(parseInt(values[1]))) {
      const days = parseInt(values[0]);
      const percentage = parseInt(values[1]);
      const dayText = days > 1 ? 'Days' : 'Day';
      return `${label}${operatorText} ${days} ${dayText}, Get ${percentage}% off`;
    }
  }

  // Handle travelDateRange with 'between' operator
  if (rule.field === 'travelDateRange' && rule.operator === 'between') {
    const values = (rule.value as string).split(',');
    if (values.length === 2) {
      const startDate = formatToDayMonth(values[0]);
      const endDate = formatToDayMonth(values[1]);
      return `${label}${operatorText} ${startDate} - ${endDate}`;
    }
  }

  // Original logic for other cases
  const valueDisplay =
    typeof rule.value === 'boolean' || label === ''
      ? ''
      : rule.field === 'minimumSpendAmount'
      ? `$${rule.value}`
      : rule.field === 'travelDate'
      ? formatToDayMonth(rule.value as string)
      : rule.value;
  const label2Display = label2 && Number(rule.value) > 1 ? `${label2}s` : label2;

  return rule.field === 'emailVerified' && rule.operator === '=' ? `${label}` : `${label} ${operatorText} ${valueDisplay} ${label2Display || ''}`;
};

const VoucherRules: React.FC<VoucherRulesProps> = ({ rules, isDetails = false }) => {
  // Count specificReservationDays rules
  const specificDaysCount = rules.filter((rule) => rule.field === 'specificReservationDays').length;

  return (
    <>
      {rules?.map((rule, index) => {
        const { icon } = iconMapping[rule.field] || { icon: null };
        const displayText = getDisplayText(rule, specificDaysCount)?.trim();

        return isDetails ? (
          <>{displayText ? <ListItem key={index}>{displayText}</ListItem> : null}</>
        ) : (
          <div key={index} className="flex items-start">
            {icon && <span className="pr-1 mt-0.5 text-primary">{icon}</span>}
            <span className="text-left sm:text-sm text-black">{displayText}</span>
          </div>
        );
      })}
    </>
  );
};

export default VoucherRules;
