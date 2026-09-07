"use client";

import { useEffect, useState } from "react";

import {
    Gift as GiftIcon,
    Plus,
} from "lucide-react";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchGifts,
    toggleGiftStatus,
} from "@/store/slices/GiftsSlices/giftsSlice";

// import Search from "@/components/common/Search";
import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import { toast } from "react-toastify";

import TogglableSwitch from "@/components/common/TogglableSwitch";

import EditGiftModal from "@/components/modals/Gifts/EditGiftModal";
import AddGiftModal from "@/components/modals/Gifts/AddGiftModal";
import Button from "@/components/common/Button";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";
import Action from "@/components/common/Action";

import type { Gift } from "@/types/GiftsTypes/gifts.types";

const Gifts = () => {

    const dispatch = useAppDispatch();

    const {
        gifts,
        pagination,
        loading,
    } = useAppSelector(
        (state) => state.gifts
    );

    const [searchInput, setSearchInput] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [isAddGiftModalOpen, setIsAddGiftModalOpen] =
        useState(false);

    const [isEditGiftModalOpen, setIsEditGiftModalOpen] =
        useState(false);

    const [selectedGift, setSelectedGift] =
        useState<Gift | null>(null);

    const [statusLoadingGiftId, setStatusLoadingGiftId] =
        useState<number | null>(null);


    /*
     * ==========================================
     * FETCH GIFTS
     * ==========================================
     */

    useEffect(() => {

        dispatch(
            fetchGifts({
                page: currentPage,
                pageSize: rowsPerPage,
                search: searchTerm,
            })
        );

    }, [
        dispatch,
        currentPage,
        rowsPerPage,
        searchTerm,
    ]);


    /*
     * ==========================================
     * SEARCH
     * ==========================================
     */

    const handleSearchChange = (
        value: string
    ) => {
        setSearchInput(value);
    };

    useEffect(() => {

        const timer =
            setTimeout(() => {

                setSearchTerm(searchInput);

                setCurrentPage(1);

            }, 1000);

        return () => {
            clearTimeout(timer);
        };

    }, [searchInput]);


    /*
     * ==========================================
     * PAGINATION
     * ==========================================
     */

    const handlePageChange = (
        page: number
    ) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (
        rows: number
    ) => {

        setRowsPerPage(rows);

        setCurrentPage(1);
    };


    /*
     * ==========================================
     * EDIT
     * ==========================================
     */

    const handleEditGift = (
        gift: Gift
    ) => {

        setSelectedGift(gift);

        setIsEditGiftModalOpen(true);
    };


    const refreshGifts = () => {

        dispatch(
            fetchGifts({
                page: currentPage,
                pageSize: rowsPerPage,
                search: searchTerm,
            })
        );
    };


    const handleGiftUpdated = () => {

        setIsEditGiftModalOpen(false);

        setSelectedGift(null);

        refreshGifts();
    };


    /*
     * ==========================================
     * STATUS
     * ==========================================
     */

    const handleToggleStatus = async (
        gift: Gift
    ) => {

        if (statusLoadingGiftId !== null) {
            return;
        }

        const newStatus =
            !gift.status;

        setStatusLoadingGiftId(
            gift.gift_id
        );

        try {

            const result =
                await dispatch(
                    toggleGiftStatus({
                        giftId: gift.gift_id,

                        payload: {
                            status: newStatus,
                        },
                    })
                );

            if (
                toggleGiftStatus.fulfilled.match(
                    result
                )
            ) {

                toast.success(
                    `Gift ${newStatus
                        ? "activated"
                        : "deactivated"
                    } successfully`
                );

                /*
                 * Slice already updates the
                 * local status optimistically
                 * after successful API response.
                 *
                 * No unnecessary second request.
                 */

            } else {

                toast.error(
                    result.payload ||
                    "Failed to update gift status"
                );
            }

        } catch {

            toast.error(
                "Failed to update gift status"
            );

        } finally {

            setStatusLoadingGiftId(null);
        }
    };


    /*
     * ==========================================
     * DATE
     * ==========================================
     */

    const formatDate = (
        date: string
    ) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date)
            .toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );
    };


    const formatTime = (
        date: string
    ) => {

        if (!date) {
            return "";
        }

        return new Date(date)
            .toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );
    };


    /*
     * ==========================================
     * CATEGORY NAME
     * ==========================================
     */

    const getCategoryName = (
        gift: Gift
    ) => {

        if (
            gift.gift_category_name
        ) {
            return gift.gift_category_name;
        }

        if (
            gift.category?.name
        ) {
            return gift.category.name;
        }

        return "N/A";
    };


    /*
     * ==========================================
     * TABLE COLUMNS
     * ==========================================
     */

    const columns = [

        {
            label: "S.L",
            width: "70px",
        },

        {
            label: "Gift Image",
            width: "110px",
        },

        {
            label: "Gift Name",
            width: "200px",
        },

        {
            label: "Category Name",
            width: "180px",
        },

        {
            label: "Coins",
            width: "130px",
        },

        {
            label: "Created At",
            width: "180px",
        },

        {
            label: "Status",
            width: "160px",
        },

        {
            label: "Actions",
            width: "120px",
            className: "text-center",
        },
    ];


    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* HEADER */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        Gifts
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        Manage and monitor all available gifts.
                    </p>

                </div>


                <div className="flex w-full items-center gap-3 lg:w-auto">

                    {/* <div className="w-full lg:w-[305px]">

                        <Search
                            searchTerm={searchInput}
                            setSearchTerm={
                                handleSearchChange
                            }
                            placeholder="Search gifts by Name..."
                        />

                    </div> */}

                    <Button
                        type="button"
                        onClick={() =>
                            setIsAddGiftModalOpen(true)
                        }
                        className="!w-auto h-[40px] shrink-0 rounded-[8px] px-4 py-2 text-[13px] font-semibold whitespace-nowrap"
                    >

                        <Plus size={16} />

                        <span>
                            Add Gift
                        </span>

                    </Button>
                </div>

            </div>


            {/* TABLE */}

            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[1250px] border-collapse text-left">

                        <TableHeader
                            columns={columns}
                            showCheckbox={false}
                        />


                        <tbody className="divide-y divide-[#EAECF0]">

                            {loading ? (

                                <TableSkeleton
                                    rows={rowsPerPage}
                                />

                            ) : gifts.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="px-6 py-16 text-center"
                                    >

                                        <div className="flex flex-col items-center justify-center">

                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">

                                                <GiftIcon
                                                    size={22}
                                                    className="text-[#2563EB]"
                                                />

                                            </div>

                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No gifts found
                                            </p>

                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                Try changing your search.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                gifts.map(
                                    (
                                        gift,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                gift.gift_id
                                            }
                                            className="transition-colors hover:bg-[#F9FAFB]"
                                        >

                                            {/* S.L */}

                                            <td className="px-5 py-4">

                                                <p className="text-[13px] font-medium text-[#475467]">

                                                    {(
                                                        currentPage -
                                                        1
                                                    ) *
                                                        rowsPerPage +
                                                        index +
                                                        1}

                                                </p>

                                            </td>


                                            {/* IMAGE */}

                                            <td className="px-5 py-4">

                                                {gift.gift_thumbnail ? (

                                                    <img
                                                        src={
                                                            gift.gift_thumbnail
                                                        }
                                                        alt={
                                                            gift.name
                                                        }
                                                        className="h-11 w-11 rounded-full border border-gray-200 object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#F9FAFB]">

                                                        <GiftIcon
                                                            size={18}
                                                            className="text-[#667085]"
                                                        />

                                                    </div>

                                                )}

                                            </td>


                                            {/* NAME */}

                                            <td className="px-5 py-4">

                                                <p className="truncate text-[14px] font-semibold text-[#101828]">

                                                    {gift.name}

                                                </p>

                                            </td>


                                            {/* CATEGORY */}

                                            <td className="px-5 py-4">

                                                <p className="text-[13px] font-medium text-[#475467]">

                                                    {
                                                        getCategoryName(
                                                            gift
                                                        )
                                                    }

                                                </p>

                                            </td>


                                            {/* COINS */}

                                            <td className="px-5 py-4">

                                                <p className="text-[13px] font-medium text-[#475467]">

                                                    {
                                                        gift.gift_value
                                                    }

                                                </p>

                                            </td>


                                            {/* CREATED */}

                                            <td className="px-5 py-4">

                                                <DateTime
                                                    date={formatDate(
                                                        gift.createdAt
                                                    )}
                                                    time={formatTime(
                                                        gift.createdAt
                                                    )}
                                                />

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-5 py-4">

                                                <TogglableSwitch
                                                    isActive={
                                                        gift.status
                                                    }
                                                    onToggle={() =>
                                                        handleToggleStatus(
                                                            gift
                                                        )
                                                    }
                                                    activeLabel="Active"
                                                    inactiveLabel="Inactive"
                                                    activeClassName="bg-emerald-50 text-emerald-600"
                                                    inactiveClassName="bg-red-50 text-red-600"
                                                    showLabel
                                                    loading={
                                                        statusLoadingGiftId ===
                                                        gift.gift_id
                                                    }
                                                />

                                            </td>


                                            {/* ACTION */}

                                            <td className="px-5 py-4">

                                                <Action
                                                    showView={
                                                        false
                                                    }
                                                    showEdit
                                                    showDelete={
                                                        false
                                                    }
                                                    onEdit={() =>
                                                        handleEditGift(
                                                            gift
                                                        )
                                                    }
                                                />

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* PAGINATION */}

            {!loading &&
                pagination.total_pages >
                0 && (

                    <div className="mt-5 w-full">

                        <Pagination
                            currentPage={
                                pagination.current_page
                            }
                            totalPages={
                                pagination.total_pages
                            }
                            rowsPerPage={
                                pagination.records_per_page
                            }
                            onPageChange={
                                handlePageChange
                            }
                            onRowsPerPageChange={
                                handleRowsPerPageChange
                            }
                            rowsPerPageOptions={[
                                5,
                                10,
                                20,
                                50,
                            ]}
                            showRowsPerPage
                            showPageInfo
                        />

                    </div>

                )}


            {/* ADD */}

            <AddGiftModal
                isOpen={
                    isAddGiftModalOpen
                }
                onClose={() =>
                    setIsAddGiftModalOpen(
                        false
                    )
                }
                onSuccess={
                    refreshGifts
                }
            />


            {/* EDIT */}

            {selectedGift && (

                <EditGiftModal
                    isOpen={
                        isEditGiftModalOpen
                    }
                    gift={
                        selectedGift
                    }
                    onClose={() => {

                        setIsEditGiftModalOpen(
                            false
                        );

                        setSelectedGift(
                            null
                        );

                    }}
                    onSuccess={
                        handleGiftUpdated
                    }
                />

            )}

        </div>
    );
};

export default Gifts;