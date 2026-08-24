import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Loader2 } from 'lucide-react';

type StringOption = string;
type ObjectOption = { value: string; label: string };
type SelectOption = StringOption | ObjectOption;

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  searchable?: boolean;
  error?: boolean;
  disabled?: boolean;
  onSearch?: (search: string) => void;
  onScrollEnd?: () => void;
  loading?: boolean;
}

function isObjectOption(opt: SelectOption): opt is ObjectOption {
  return typeof opt === 'object' && opt !== null;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select',
  icon,
  searchable = true,
  error = false,
  disabled = false,
  onSearch,
  onScrollEnd,
  loading = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingRef = useRef(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
    if (!isOpen) setSearch('');
  }, [isOpen, searchable]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (onSearch) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch(val);
      }, 900);
    }
  };

  const handleScroll = () => {
    if (!onScrollEnd || !listRef.current || isScrollingRef.current || isLoadingRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollHeight - scrollTop - clientHeight < 40) {
      isScrollingRef.current = true;
      isLoadingRef.current = true;
      onScrollEnd();
      setTimeout(() => {
        isScrollingRef.current = false;
        isLoadingRef.current = false;
      }, 1200);
    }
  };

  const selectedLabel = (() => {
    const match = options.find((opt) =>
      isObjectOption(opt) ? opt.value === value : opt === value
    );
    if (!match) return null;
    return isObjectOption(match) ? match.label : match;
  })();

  const filteredOptions = onSearch
    ? options
    : search
      ? options.filter((opt) => {
        const label = isObjectOption(opt) ? opt.label : opt;
        return label.toLowerCase().includes(search.toLowerCase());
      })
      : options;

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If there's more space above, open upwards
      if (spaceAbove > spaceBelow && spaceAbove > 200) {
        return { bottom: '100%', top: 'auto', marginBottom: '4px' };
      }
      return { top: '100%', bottom: 'auto', marginTop: '4px' };
    }
    return { top: '100%', bottom: 'auto', marginTop: '4px' };
  };

  const position = getDropdownPosition();

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) setIsOpen(!isOpen); }}
        className={`w-full flex items-center justify-between py-2.5 px-3 border rounded-[8px] bg-white text-sm outline-none transition-all
          ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
          ${isOpen ? 'border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]' : error ? 'border-red-500 hover:border-red-400' : 'border-gray-300 hover:border-[var(--brand-primary)]'}`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
          <span className={value ? 'text-gray-900 truncate' : 'text-gray-500 truncate'}>
            {selectedLabel ?? placeholder}
          </span>
        </div>
        <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute z-[99999] w-full bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col overflow-hidden"
          style={{
            maxHeight: '260px',
            ...position
          }}
        >
          {searchable && (
            <div className="p-2 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-md border border-gray-200 focus-within:border-[var(--brand-primary)]  transition-all">
                <Search size={13} className="text-gray-400 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400 min-w-0"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto flex-1" ref={listRef} onScroll={handleScroll}>
            {filteredOptions.length === 0 && !loading ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                {onSearch && !search ? 'Type to search...' : 'No options found'}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const optValue = isObjectOption(option) ? option.value : option;
                const optLabel = isObjectOption(option) ? option.label : option;
                return (
                  <div
                    key={optValue}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-gray-50 truncate ${value === optValue ? 'bg-[var(--sidebar-active-bg)] text-[var(--brand-primary)] font-semibold' : 'text-gray-700'}`}
                    onClick={() => { onChange(optValue); setIsOpen(false); setSearch(''); }}
                    title={optLabel}
                  >
                    {optLabel}
                  </div>
                );
              })
            )}
            {loading && (
              <div className="flex justify-center py-2">
                <Loader2 size={16} className="animate-spin text-[var(--brand-primary)]" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}