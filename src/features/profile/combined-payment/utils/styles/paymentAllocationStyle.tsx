// ─── Rows ─────────────────────────────────────────────────────────────────────

import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';

export const DueRow = ({ label, value }: { label: string; value: number }) => {
  if (value <= 0) return null;
  return (
    <li className="flex justify-between text-sm py-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">${parseFloatWithPrecision(value)}</span>
    </li>
  );
};

export const AllocRow = ({ label, value, due }: { label: string; value: number; due: number }) => {
  if (due <= 0) return null;
  const remaining = due - value;
  return (
    <li className="flex justify-between text-sm py-1">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-medium">
        Allocated: <span className="font-semibold text-primary">${parseFloatWithPrecision(value)}</span>
        <span className="text-gray-400 mx-1.5">|</span>
        Remaining Due: <span className="font-semibold text-gray-600">${parseFloatWithPrecision(remaining)}</span>
      </span>
    </li>
  );
};
