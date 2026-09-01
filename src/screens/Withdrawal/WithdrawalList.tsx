"use client";

import { useEffect, useState } from "react";
import { ArrowDownCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWithdrawals } from "@/store/slices/WithdrawalSlices/withdrawalSlice";
import { fetchWithdrawalDetails } from "@/store/slices/WithdrawalSlices/withdrawalSlice";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableHeader from "@/components/common/TableHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import Search from "@/components/common/Search";
import Action from "@/components/common/Action";

const columns = [
    { label: "#", width: "60px" },
    { label: "User", width: "180px" },
    { label: "Payment Method", width: "150px" },
    { label: "Amount", width: "120px" },
    { label: "Coins", width: "100px" },
    { label: "Status", width: "120px" },
    { label: "Created At", width: "150px" },
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

const getStatusVariant = (status: string): "green" | "red" | "orange" | "gray" => {
    switch (status) {
        case "approved": return "green";
        case "rejected": return "red";
        case "pending": return "orange";
        default: return "gray";
    }
};

const WithdrawalList = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { withdrawals, loading, error } = useAppSelector((state) => state.withdrawal);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchWithdrawals());
    }, [dispatch]);

    const filtered = withdrawals.filter((w) =>
        w.User?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.User?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(w.transaction_id).includes(searchTerm)
    );

    const handleView = async (transaction_id: number) => {
        await dispatch(fetchWithdrawalDetails(transaction_id));
        router.push(`/withdrawal/view?transaction_id=${transaction_id}`);
    };

    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">
            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold text-[#101828]">Withdrawal List</h1>
                    <p className="mt-1 text-[14px] text-[#667085]">View and manage all withdrawal requests.</p>
                </div>
                <div className="w-full lg:w-[300px]">
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search withdrawals..." />
                </div>
            </div>

            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">
                <div className="w-full overflow-x-auto">
                    <table className="w-full table-fixed border-collapse text-left">
                        <TableHeader columns={columns} showCheckbox={false} />
                        <tbody className="divide-y divide-[#EAECF0]">
                            {loading ? (
                                <TableSkeleton rows={5} />
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">
                                                <ArrowDownCircle size={22} className="text-[#2563EB]" />
                                            </div>
                                            <p className="text-[15px] font-semibold text-[#101828]">No withdrawals found</p>
                                            <p className="mt-1 text-[13px] text-[#667085]">No withdrawal requests available.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((w, index) => (
                                    <tr key={w.transaction_id} className="transition-colors hover:bg-[#F9FAFB]">
                                        <td className="px-5 py-4 text-[13px] text-[#667085]">{index + 1}</td>
                                        <td className="px-5 py-4">
                                            <p className="text-[14px] font-medium text-[#101828]">
                                                {w.User?.first_name} {w.User?.last_name}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-[#98A2B3]">{w.User?.email}</p>
                                        </td>
                                        <td className="px-5 py-4 text-[13px] capitalize text-[#344054]">
                                            {w.payment_method}
                                        </td>
                                        <td className="px-5 py-4 text-[13px] font-medium text-[#344054]">
                                            {w.acutal_money} {w.currency}
                                        </td>
                                        <td className="px-5 py-4 text-[13px] text-[#344054]">{w.coin}</td>
                                        <td className="px-5 py-4">
                                            <Tags
                                                text={w.success.charAt(0).toUpperCase() + w.success.slice(1)}
                                                variant={getStatusVariant(w.success)}
                                            />
                                        </td>
                                        <td className="px-5 py-4">
                                            <DateTime date={formatDate(w.createdAt)} time={formatTime(w.createdAt)} />
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <Action
                                                showView
                                                showEdit={false}
                                                showDelete={false}
                                                onView={() => handleView(w.transaction_id)}
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

export default WithdrawalList;
