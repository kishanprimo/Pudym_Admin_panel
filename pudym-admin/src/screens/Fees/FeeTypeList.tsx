"use client";

import { useEffect, useState } from "react";
import { Percent, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchPlatformFees,
    removePlatformFee,
    clearDeleteError,
} from "@/store/slices/FeesSlices/feesSlice";

import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableHeader from "@/components/common/TableHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import Search from "@/components/common/Search";
import Action from "@/components/common/Action";
import UserDeleteModal from "@/components/common/UserDeleteModal";


const FEE_TYPE_LABELS: Record<string, string> = {
    subscription: "Subscription",
    post_support: "Post Support",
    live_gift_support: "Live Gift Support",
    profile_support: "Profile Support",
    campaign_support: "Campaign Support",
};

const columns = [
    { label: "#", width: "60px" },
    { label: "Fee Type", width: "200px" },
    { label: "Fee Percentage", width: "160px" },
    { label: "Status", width: "120px" },
    { label: "Created At", width: "150px" },
    { label: "Updated At", width: "150px" },
    { label: "Action", width: "100px", className: "text-center" },
];

const formatDate = (date: string) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};


const FeeTypeList = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();

    const { fees, loading, error, deleteLoading, deleteError } =
        useAppSelector((state) => state.fees);

    const [searchTerm, setSearchTerm] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const filteredFees = fees.filter((fee) =>
        fee.fee_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (FEE_TYPE_LABELS[fee.fee_type] ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        dispatch(fetchPlatformFees());
    }, [dispatch]);


    /*
     * ==========================================
     * DELETE
     * ==========================================
     */

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        const result = await dispatch(removePlatformFee(deleteTarget));
        if (removePlatformFee.fulfilled.match(result)) {
            setDeleteTarget(null);
        }
    };


    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        Fee Type List
                    </h1>
                    <p className="mt-1 text-[14px] text-[#667085]">
                        View and manage all platform fee types.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Search
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Search fee types..."
                    />
                    <button
                        type="button"
                        onClick={() => router.push("/fees/add-fee-type")}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1D4ED8]"
                    >
                        <Plus size={15} />
                        Add
                    </button>
                </div>

            </div>


            {/* ERROR */}
            {(error || deleteError) && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                    {error || deleteError}
                </div>
            )}


            {/* ========================================
                TABLE
            ======================================== */}

            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                <div className="w-full overflow-x-auto">

                    <table className="w-full table-fixed border-collapse text-left">

                        <TableHeader columns={columns} showCheckbox={false} />

                        <tbody className="divide-y divide-[#EAECF0]">

                            {loading ? (

                                <TableSkeleton rows={5} />

                            ) : filteredFees.length === 0 ? (

                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">
                                                <Percent size={22} className="text-[#2563EB]" />
                                            </div>
                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No fee types found
                                            </p>
                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                Add a fee type to get started.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                            ) : (

                                filteredFees.map((fee, index) => (

                                    <tr
                                        key={fee.fee_id}
                                        className="transition-colors hover:bg-[#F9FAFB]"
                                    >

                                        {/* # */}
                                        <td className="px-5 py-4 text-[13px] text-[#667085]">
                                            {index + 1}
                                        </td>

                                        {/* FEE TYPE */}
                                        <td className="px-5 py-4">
                                            <p className="text-[14px] font-medium text-[#101828]">
                                                {FEE_TYPE_LABELS[fee.fee_type] ?? fee.fee_type}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-[#98A2B3]">
                                                {fee.fee_type}
                                            </p>
                                        </td>

                                        {/* FEE PERCENTAGE */}
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1 rounded-lg bg-[#EFF6FF] px-2.5 py-1 text-[13px] font-semibold text-[#2563EB]">
                                                <Percent size={12} />
                                                {fee.fee_percentage}
                                            </span>
                                        </td>

                                        {/* STATUS */}
                                        <td className="px-5 py-4">
                                            <Tags
                                                text={fee.status === "active" ? "Active" : "Inactive"}
                                                variant={fee.status === "active" ? "emerald" : "gray"}
                                            />
                                        </td>

                                        {/* CREATED AT */}
                                        <td className="px-5 py-4">
                                            <DateTime
                                                date={formatDate(fee.created_at)}
                                                time={formatTime(fee.created_at)}
                                            />
                                        </td>

                                        {/* UPDATED AT */}
                                        <td className="px-5 py-4">
                                            <DateTime
                                                date={formatDate(fee.updated_at)}
                                                time={formatTime(fee.updated_at)}
                                            />
                                        </td>

                                        {/* ACTION */}
                                        <td className="px-5 py-4 text-center">
                                            <Action
                                                showView={false}
                                                showEdit
                                                showDelete
                                                onEdit={() =>
                                                    router.push(
                                                        `/fees/edit-fee-type?fee_type=${fee.fee_type}`
                                                    )
                                                }
                                                onDelete={() => {
                                                    dispatch(clearDeleteError());
                                                    setDeleteTarget(fee.fee_type);
                                                }}
                                            />
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ========================================
                DELETE MODAL
            ======================================== */}

            {deleteTarget && (
                <UserDeleteModal
                    title="Delete Fee Type?"
                    message="This fee type will be permanently deleted. This action cannot be undone."
                    confirmText="Delete"
                    loading={deleteLoading}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDeleteConfirm}
                />
            )}

        </div>
    );
};

export default FeeTypeList;
