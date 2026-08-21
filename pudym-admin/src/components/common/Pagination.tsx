import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
    rowsPerPageOptions?: number[];
    showRowsPerPage?: boolean;
    showPageInfo?: boolean;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 20, 50],
    showRowsPerPage = true,
    showPageInfo = true,
    className = '',
}: PaginationProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const handleRowsPerPageChange = (rows: number) => {
        onRowsPerPageChange(rows);
        setIsDropdownOpen(false);
    };

    // Generate page numbers - max 3 pages visible
    const getPageNumbers = () => {
        const pages: number[] = [];

        if (totalPages <= 3) {
            // Show all pages if total pages are 3 or less
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage === 1) {
                // On first page: show 1, 2, 3
                pages.push(1, 2, 3);
            } else if (currentPage === totalPages) {
                // On last page: show total-2, total-1, total
                pages.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                // In middle: show current-1, current, current+1
                pages.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }

        return pages;
    };

    return (
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}>
            {/* Rows Per Page */}
            {showRowsPerPage && (
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-[14px] px-4 h-[48px]">
                    <span className="text-[16px] font-semibold text-[#344054] whitespace-nowrap">
                        Rows per page:
                    </span>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-1 text-[16px] font-semibold text-[#101828] cursor-pointer"
                        >
                            {rowsPerPage}
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>
                        {isDropdownOpen && (
                            <ul className="absolute bottom-full mb-2 left-0 w-[80px] bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                                {rowsPerPageOptions.map((val) => (
                                    <li
                                        key={val}
                                        onClick={() => handleRowsPerPageChange(val)}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                                    >
                                        {val}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center gap-4">
                {showPageInfo && (
                    <p className="text-[16px] font-medium text-[#344054] whitespace-nowrap">
                        Page {currentPage} of {totalPages}
                    </p>
                )}

                <div className="flex items-center gap-2">
                    {/* First Page */}
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-[10px] border border-gray-200 bg-white flex items-center justify-center text-[#475467] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        «
                    </button>

                    {/* Previous Page */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-[10px] border border-gray-200 bg-white flex items-center justify-center text-[#475467] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        ‹
                    </button>

                    {/* Page Numbers - Max 3 */}
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(page)}
                            className={`w-9 h-9 rounded-[10px] text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${currentPage === page
                                    ? "bg-[#2563EB] text-white"
                                    : "border border-gray-200 bg-white text-[#344054] hover:bg-gray-50"
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Next Page */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 rounded-[10px] border border-gray-200 bg-white flex items-center justify-center text-[#475467] hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                        ›
                    </button>

                    {/* Last Page */}
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 rounded-[10px] border border-gray-200 bg-white flex items-center justify-center text-[#475467] hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                        »
                    </button>
                </div>
            </div>
        </div>
    );
}