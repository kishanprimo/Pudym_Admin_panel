import { Search as LucideSearch, X } from 'lucide-react';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    placeholder?: string;
    onClick?: () => void;
    showBadge?: boolean;
}

export default function Search({ searchTerm, setSearchTerm, placeholder, onClick, showBadge }: SearchBarProps) {
    return (
        <div
            onClick={onClick}
            className="relative w-full md:w-[350px] lg:w-[300px] xl:w-full mb-0.5"
        >
            <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />

            <input
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                placeholder={placeholder}
                className="w-full pl-9 pr-16 py-2 border border-gray-300 hover:border-[var(--brand-primary)] rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                {searchTerm ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSearchTerm('');
                        }}
                        className="text-gray-400 hover-bg-soft rounded-full p-1 transition-colors"
                    >
                        <X size={14} />
                    </button>
                ) : (
                    showBadge && (
                        <div className='bg-brand-secondary text-white rounded-md flex items-center gap-1 px-1 py-0.5 text-[13px] font-medium'>
                            <span>⌘</span>
                            <span>K</span>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}