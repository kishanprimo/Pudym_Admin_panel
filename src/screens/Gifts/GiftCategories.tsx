"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Gift, Plus } from "lucide-react";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchGiftCategories,
    toggleGiftCategoryStatus,
} from "@/store/slices/GiftsSlices/giftCategorySlice";

import type { GiftCategory } from "@/types/GiftsTypes/giftCategory.types";

import Search from "@/components/common/Search";
import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import Action from "@/components/common/Action";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";
import Button from "@/components/common/Button";
import TogglableSwitch from "@/components/common/TogglableSwitch";

import AddGiftCategoryModal from "@/components/modals/Gifts/AddGiftCategoryModal";
import EditGiftCategoryModal from "@/components/modals/Gifts/EditGiftCategoryModal";
import UserDeleteModal from "@/components/common/UserDeleteModal";


const GiftCategories = () => {

    const dispatch = useAppDispatch();


    /*
     * ==========================================
     * REDUX STATE
     * ==========================================
     */

    const {
        giftCategories,
        pagination,
        loading,
        error,
        updateLoading,
    } = useAppSelector(
        (state) => state.giftCategories
    );


    /*
     * ==========================================
     * LOCAL STATE
     * ==========================================
     */

    const [searchInput, setSearchInput] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [debouncedSearchInput, setDebouncedSearchInput] =
        useState("");
    /*
     * ==========================================
     * ADD CATEGORY MODAL
     * ==========================================
     */

    const [
        isAddCategoryModalOpen,
        setIsAddCategoryModalOpen,
    ] = useState(false);


    /*
     * ==========================================
     * EDIT CATEGORY MODAL
     * ==========================================
     */

    const [
        isEditCategoryModalOpen,
        setIsEditCategoryModalOpen,
    ] = useState(false);

    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState<GiftCategory | null>(null);


    /*
     * ==========================================
     * DELETE CATEGORY MODAL
     * ==========================================
     */

    const [
        deleteModalCategory,
        setDeleteModalCategory,
    ] = useState<GiftCategory | null>(null);


    /*
     * ==========================================
     * STATUS LOADING
     * ==========================================
     *
     * Keep track of which category is currently
     * being updated so all switches don't become
     * disabled at the same time.
     */

    const [
        statusLoadingCategoryId,
        setStatusLoadingCategoryId,
    ] = useState<number | null>(null);


    /*
     * ==========================================
     * FETCH GIFT CATEGORIES
     * ==========================================
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchInput(searchInput);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [searchInput]);
    useEffect(() => {
        dispatch(
            fetchGiftCategories({
                page: currentPage,
                pageSize: rowsPerPage,
                name: debouncedSearchInput.trim(),
            })
        );
    }, [
        dispatch,
        currentPage,
        rowsPerPage,
        debouncedSearchInput,
    ]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchInput]);


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
     * ADD CATEGORY
     * ==========================================
     */

    const handleCategoryAdded = () => {

        setIsAddCategoryModalOpen(false);

        dispatch(
            fetchGiftCategories({
                page: currentPage,
                pageSize: rowsPerPage,
                name: debouncedSearchInput.trim(),
            })
        );

    };


    /*
     * ==========================================
     * EDIT CATEGORY
     * ==========================================
     */

    const handleEditCategory = (
        category: GiftCategory
    ) => {

        setSelectedCategory(category);

        setIsEditCategoryModalOpen(true);

    };


    const handleCategoryUpdated = () => {

        setIsEditCategoryModalOpen(false);

        setSelectedCategory(null);

        dispatch(
            fetchGiftCategories({
                page: currentPage,
                pageSize: rowsPerPage,
                name: debouncedSearchInput.trim(),
            })
        );

    };


    /*
     * ==========================================
     * TOGGLE CATEGORY STATUS
     * ==========================================
     *
     * Active -> Inactive
     *
     * Inactive -> Active
     *
     * The API is called through
     * toggleGiftCategoryStatus.
     */

    const handleToggleStatus = async (
        category: GiftCategory
    ) => {
        if (statusLoadingCategoryId !== null) {
            return;
        }

        const newStatus = !category.status;

        setStatusLoadingCategoryId(
            category.gift_category_id
        );

        try {
            const result = await dispatch(
                toggleGiftCategoryStatus({
                    giftCategoryId:
                        category.gift_category_id,

                    payload: {
                        status: newStatus,
                    },
                })
            );

            if (
                toggleGiftCategoryStatus.fulfilled.match(
                    result
                )
            ) {
                toast.success(
                    `Category ${newStatus
                        ? "activated"
                        : "deactivated"
                    } successfully`
                );
            } else {
                toast.error(
                    result.payload ||
                    "Failed to update category status"
                );
            }
        } catch (error) {
            toast.error(
                "Failed to update category status"
            );
        } finally {
            setStatusLoadingCategoryId(null);
        }
    };

    /*
     * ==========================================
     * DELETE CATEGORY
     * ==========================================
     *
     * At the moment the delete API/thunk has not
     * been provided.
     *
     * Clicking the delete icon opens the same
     * reusable UserDeleteModal used by AllUsers.
     *
     * Once the delete thunk is available, the
     * confirm handler can be connected here.
     */

    const handleDeleteCategory = (
        category: GiftCategory
    ) => {

        setDeleteModalCategory(category);

    };


    const handleConfirmDelete = () => {

        if (!deleteModalCategory) {
            return;
        }


        /*
         * Delete API is not connected yet.
         *
         * Keep the modal behaviour ready for the
         * actual delete thunk.
         */

        toast.info(
            `Delete API is not connected yet for "${deleteModalCategory.name}".`
        );

        setDeleteModalCategory(null);

    };


    /*
     * ==========================================
     * TABLE COLUMNS
     * ==========================================
     */

    const columns = [
        {
            label: "S.L",
            width: "80px",
        },
        {
            label: "Category Name",
            width: "280px",
        },
        {
            label: "Gift Count",
            width: "160px",
        },
        {
            label: "Created Date/Time",
            width: "220px",
        },
        {
            label: "Status",
            width: "220px",
        },
        {
            label: "Actions",
            width: "150px",
            className: "text-center",
        },
    ];


    /*
     * ==========================================
     * DATE FORMATTERS
     * ==========================================
     */

    const formatDate = (
        date: string
    ) => {

        if (!date) {
            return "N/A";
        }

        return new Date(
            date
        ).toLocaleDateString(
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

        return new Date(
            date
        ).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    /*
     * ==========================================
     * RENDER
     * ==========================================
     */

    return (

        <div className="px-5 py-5 md:px-6 lg:px-7">


            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        Gift Categories
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        Manage and monitor all gift categories.
                    </p>

                </div>

                <div className="flex w-full min-w-0 items-center gap-3 lg:w-auto">

                    {/* SEARCH */}

                    <div className="min-w-0 flex-1 lg:w-[305px] lg:flex-none">

                        <Search
                            searchTerm={searchInput}
                            setSearchTerm={setSearchInput}
                            placeholder="Search gift categories..."
                        />

                    </div>


                    {/* ADD CATEGORY */}

                    <Button
                        type="button"
                        onClick={() =>
                            setIsAddCategoryModalOpen(true)
                        }
                        className="!w-auto h-[40px] shrink-0 rounded-[8px] px-4 py-2 text-[13px] font-semibold whitespace-nowrap"
                    >

                        <Plus size={16} />

                        <span>
                            Add Gift Category
                        </span>

                    </Button>

                </div>

            </div>


            {/* ========================================
                ERROR
            ======================================== */}

            {error && (

                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                    {error}

                </div>

            )}


            {/* ========================================
                TABLE
            ======================================== */}

            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[1100px] border-collapse text-left">

                        <TableHeader
                            columns={columns}
                            showCheckbox={false}
                        />


                        <tbody className="divide-y divide-[#EAECF0]">


                            {/* ========================================
                                LOADING
                            ======================================== */}

                            {loading ? (

                                <TableSkeleton
                                    rows={rowsPerPage}
                                />

                            ) : giftCategories.length === 0 ? (

                                /* ========================================
                                    EMPTY
                                ======================================== */

                                <tr>

                                    <td
                                        colSpan={6}
                                        className="px-6 py-16 text-center"
                                    >

                                        <div className="flex flex-col items-center justify-center">

                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">

                                                <Gift
                                                    size={22}
                                                    className="text-[#2563EB]"
                                                />

                                            </div>


                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No gift categories found
                                            </p>


                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                Try changing your search.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                /* ========================================
                                    DATA
                                ======================================== */

                                giftCategories.map(
                                    (
                                        category,
                                        index
                                    ) => {

                                        const serialNumber =
                                            (
                                                currentPage - 1
                                            ) *
                                            rowsPerPage +
                                            index +
                                            1;


                                        const isStatusLoading =
                                            statusLoadingCategoryId ===
                                            category.gift_category_id;


                                        return (

                                            <tr
                                                key={
                                                    category.gift_category_id
                                                }
                                                className="transition-colors hover:bg-[#F9FAFB]"
                                            >


                                                {/* ========================================
                                                    S.L
                                                ======================================== */}

                                                <td className="px-5 py-4">

                                                    <p className="text-[13px] font-medium text-[#475467]">
                                                        {serialNumber}
                                                    </p>

                                                </td>


                                                {/* ========================================
                                                    CATEGORY NAME
                                                ======================================== */}

                                                <td className="px-5 py-4">

                                                    <p className="truncate text-[14px] font-semibold text-[#101828]">
                                                        {category.name}
                                                    </p>

                                                </td>


                                                {/* ========================================
                                                    GIFT COUNT
                                                ======================================== */}

                                                <td className="pl-12 px-5 py-4">

                                                    <p className="text-[14px] font-medium text-[#475467]">
                                                        {category.gift_count ?? 0}
                                                    </p>

                                                </td>


                                                {/* ========================================
                                                    CREATED DATE / TIME
                                                ======================================== */}

                                                <td className="pl-12 px-5 py-4">

                                                    <DateTime
                                                        date={formatDate(
                                                            category.createdAt
                                                        )}
                                                        time={formatTime(
                                                            category.createdAt
                                                        )}
                                                    />

                                                </td>


                                                {/* ========================================
                                                    STATUS
                                                ======================================== */}

                                                <td className="px-5 py-4">

                                                    <TogglableSwitch
                                                        isActive={category.status}
                                                        onToggle={() =>
                                                            handleToggleStatus(category)
                                                        }
                                                        activeLabel="Active"
                                                        inactiveLabel="Inactive"
                                                        activeClassName="bg-emerald-50 text-emerald-600"
                                                        inactiveClassName="bg-red-50 text-red-600"
                                                        showLabel
                                                        loading={isStatusLoading}
                                                    />

                                                </td>


                                                {/* ========================================
                                                    ACTIONS
                                                ======================================== */}

                                                <td className="px-5 py-4">

                                                    <Action
                                                        showView={false}
                                                        showEdit
                                                        showDelete={false}
                                                        onEdit={() =>
                                                            handleEditCategory(
                                                                category
                                                            )
                                                        }
                                                        onDelete={() =>
                                                            handleDeleteCategory(
                                                                category
                                                            )
                                                        }
                                                    />

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ========================================
                PAGINATION
            ======================================== */}

            {!loading &&
                pagination.total_pages > 0 && (

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


            {/* ========================================
                ADD CATEGORY MODAL
            ======================================== */}

            <AddGiftCategoryModal
                isOpen={
                    isAddCategoryModalOpen
                }
                onClose={() =>
                    setIsAddCategoryModalOpen(false)
                }
                onSuccess={
                    handleCategoryAdded
                }
            />


            {/* ========================================
                EDIT CATEGORY MODAL
            ======================================== */}

            {selectedCategory && (

                <EditGiftCategoryModal
                    isOpen={
                        isEditCategoryModalOpen
                    }
                    category={
                        selectedCategory
                    }
                    onClose={() => {

                        if (!updateLoading) {

                            setIsEditCategoryModalOpen(
                                false
                            );

                            setSelectedCategory(
                                null
                            );

                        }

                    }}
                    onSuccess={
                        handleCategoryUpdated
                    }
                />

            )}


            {/* ========================================
                DELETE CATEGORY MODAL
            ======================================== */}

            {deleteModalCategory && (

                <UserDeleteModal
                    onClose={() => {
                        setDeleteModalCategory(
                            null
                        );
                    }}
                    onConfirm={
                        handleConfirmDelete
                    }
                    title="Delete Gift Category?"
                    message={`"${deleteModalCategory.name}" will be permanently deleted. You cannot undo this action.`}
                    confirmText="Delete"
                    loading={false}
                />

            )}

        </div>

    );

};


export default GiftCategories;