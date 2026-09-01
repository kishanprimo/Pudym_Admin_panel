import { useRef } from "react";

interface Column {
  label: string;
  className?: string;
  width?: string;
}

interface TableHeaderProps {
  columns: Column[];
  showCheckbox?: boolean;
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
  onSelectAll?: (checked: boolean) => void;
}

export default function TableHeader({
  columns,
  showCheckbox = true,
  isAllSelected = false,
  isIndeterminate = false,
  onSelectAll,
}: TableHeaderProps) {
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  return (
    <thead className="bg-[#F9FAFB] border-b border-[#EAECF0]">
      <tr className="text-[14px] font-medium text-[#667085] font-poppins">
        {showCheckbox && onSelectAll && (
          <th className="px-6 py-4 w-12">
            <input
              type="checkbox"
              className="rounded-md cursor-pointer border-gray-300 text-indigo-600 mt-1 h-4.5 w-4.5 focus:ring-indigo-500"
              checked={isAllSelected}
              ref={(el) => {
                checkboxRef.current = el;
                if (el) {
                  el.indeterminate = isIndeterminate;
                }
              }}
              onChange={(e) => onSelectAll?.(e.target.checked)}
            />
          </th>
        )}
        {columns.map((col, idx) => (
          <th
            key={idx}
            className={`px-6 py-4 font-medium text-[#667085] whitespace-nowrap ${col.className || ""}`}
            style={col.width ? { minWidth: col.width, width: col.width } : undefined}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}