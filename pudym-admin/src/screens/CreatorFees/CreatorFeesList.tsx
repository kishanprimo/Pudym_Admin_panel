"use client";

import { useEffect, useState } from "react";
import { Percent, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCreatorFees } from "@/store/slices/CreatorFeesSlices/creatorFeesSlice";

import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableHeader from "@/components/common/TableHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import Search from "@/components/common/Search";
import Action from "@/components/common/Action";


const FEE_TYPE_LABELS: Record<string, string> = {
    subscription: "Subscription",
    post_support: "Post Support",
    live_gift_support: "Live Gift Support",
    profile_support: "Profile Support",
    campaign_support: "Campaign Support",
};

const columns = [
    { label: "#", width: "55px" },
    { label: "Creator", width: "220px" },
    { label: "Fee Type", width: "180px" },
    { label: "Fee Percentage", width: "150px" },
    { label: "Status", width: "110px" },
    { label: "Created At", width: "140px" },
    { label: "Updated At", width: "140px" },
    { label: "Action", width: "90px", className: "text-center" },
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


const CreatorFeesList = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();

    const { creatorFees, loading, error } =
        useAppSelector((state) => state.creatorFees);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchCreatorFees());
    }, [dispatch]);

    const filteredFees = creatorFees.filter((fee) => {
        const term = searchTerm.toLowerCase();
        return (
            fee.User?.email?.toLowerCase().includes(term) ||
            fee.User?.name?.toLowerCase().includes(term) ||
            (FEE_TYPE_LABELS[fee.fee_type] ?? fee.fee_type).toLowerCase().includes(term) ||
            String(fee.creator_id).includes(term)
        );
    });


    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        Creator Fees List
                    </h1>
                    <p className="mt-1 text-[14px] text-[#667085]">
                        View and manage creator-specific fee overrides.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Search
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Search by creator or fee type..."
                    />
                    <button
                        type="button"
                        onClick={() => router.push("/fees/add-creator-fee")}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1D4ED8]"
                    >
                        <Plus size={15} />
                        Add
                    </button>
                </div>

            </div>


            {/* ERROR */}
            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                    {error}
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
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">
                                                <Percent size={22} className="text-[#2563EB]" />
                                            </div>
                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No creator fees found
                                            </p>
                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                Add a creator fee to get started.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                            ) : (

                                filteredFees.map((fee, index) => (

                                    <tr
                                        key={fee.creator_fee_id}
                                        className="transition-colors hover:bg-[#F9FAFB]"
                                    >

                                        {/* # */}
                                        <td className="px-5 py-4 text-[13px] text-[#667085]">
                                            {index + 1}
                                        </td>

                                        {/* CREATOR */}
                                        <td className="px-5 py-4">
                                            <p className="truncate text-[14px] font-medium text-[#101828]">
                                                {fee.User?.name || "—"}
                                            </p>
                                            <p className="mt-0.5 truncate text-[11px] text-[#98A2B3]">
                                                {fee.User?.email || "—"}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-[#98A2B3]">
                                                ID: {fee.creator_id}
                                            </p>
                                        </td>

                                        {/* FEE TYPE */}
                                        <td className="px-5 py-4">
                                            <p className="text-[13.5px] font-medium text-[#101828]">
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
                                                showDelete={false}
                                                onEdit={() =>
                                                    router.push(
                                                        `/fees/edit-creator-fee?creator_fee_id=${fee.creator_fee_id}`
                                                    )
                                                }
                                            />
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default CreatorFeesList;
