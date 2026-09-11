import { formatCurrency } from '@/utils/Functions/randomCommonFn';
import { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface SubRow {
  label: string;
  amount?: number;
  className?: string;
  children?: SubRow[];
}

interface CollapsibleRowProps {
  label: string;
  amount?: number;
  subRows: SubRow[];
}

export const CollapsibleRow = ({ label, amount, subRows }: CollapsibleRowProps) => {
  const [open, setOpen] = useState(false);

  if (subRows.length === 0) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs text-gray-700 font-medium">{formatCurrency(amount)}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div onClick={() => setOpen((prev) => !prev)} className="flex items-center justify-between cursor-pointer group">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-700 font-semibold group-hover:text-gray-900 transition-colors">{label}</span>
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 group-hover:bg-gray-300 transition-colors">
            <MdKeyboardArrowDown size={11} className={`text-gray-600 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
          </span>
        </div>
        <span className="text-xs text-gray-700 font-semibold">{formatCurrency(amount)}</span>
      </div>

      {open && (
        <div className="flex flex-col gap-0.5 pl-2 border-l border-dashed border-gray-200 ml-1">
          {subRows.map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 leading-none pb-[2px]">{row.label}</span>
                </div>
                <span className={`text-[11px] font-medium leading-none ${row.className ?? 'text-gray-500'}`}>{formatCurrency(row.amount)}</span>
              </div>
              {row.children && row.children.length > 0 && (
                <div className="flex flex-col gap-0.5 pl-2 border-l border-dashed border-gray-100 ml-1">
                  {row.children.map((child) => (
                    <div key={child.label} className="flex items-start justify-between">
                      <span className="text-[11px] text-gray-400 leading-none pb-[2px]">{child.label}</span>
                      <span className={`text-[11px] font-medium leading-none ${child.className ?? 'text-gray-500'}`}>{formatCurrency(child.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
