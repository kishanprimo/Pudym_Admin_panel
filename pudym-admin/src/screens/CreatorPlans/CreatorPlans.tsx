"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
    Download,
    ChevronDown,
    SearchX,
    MapPin,
    CalendarDays,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import Search from "@/components/common/Search";
import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import Action from "@/components/common/Action";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";

import { fetchCreatorPlans } from "@/store/slices/CreatorPlansSlices/creatorPlansSlice";

const CreatorPlans = () => {
    const dispatch = useAppDispatch();

    /*
     * ==========================================
     * REDUX
     * ==========================================
     */

    const {
        plans,
        pagination,
        loading,
    } = useAppSelector((state) => state.creatorPlans);

    /*
     * ==========================================
     * LOCAL STATE
     * ==========================================
     */

    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

 

    const [selectedPlan, setSelectedPlan] =
        useState<(typeof plans)[number] | null>(null);

    /*
     * ==========================================
     * FETCH PLANS
     * ==========================================
     */

    useEffect(() => {
        dispatch(
            fetchCreatorPlans({
                page: currentPage,
                pageSize: rowsPerPage,
            })
        );
    }, [
        dispatch,
        currentPage,
        rowsPerPage,
    ]);

    /*
     * ==========================================
     * SEARCH
     * ==========================================
     *
     * The provided API does not show a search
     * parameter, so search is performed against
     * the currently loaded page.
     *
     * If backend later supports search, move
     * searchTerm into fetchCreatorPlans().
     */

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setCurrentPage(1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchInput]);

    /*
     * ==========================================
     * FILTERED PLANS
     * ==========================================
     */

    const filteredPlans = useMemo(() => {
        if (!searchTerm.trim()) {
            return plans;
        }

        const search = searchTerm.toLowerCase().trim();

        return plans.filter((plan) => {
            const creatorName =
                plan.creator?.full_name ||
                `${plan.creator?.first_name || ""} ${plan.creator?.last_name || ""}`.trim();

            const creatorUsername =
                plan.creator?.user_name || "";

            const creatorEmail =
                plan.creator?.email || "";

            const planName =
                plan.name || "";

            const slug =
                plan.slug || "";

            return (
                creatorName.toLowerCase().includes(search) ||
                creatorUsername.toLowerCase().includes(search) ||
                creatorEmail.toLowerCase().includes(search) ||
                planName.toLowerCase().includes(search) ||
                slug.toLowerCase().includes(search)
            );
        });
    }, [plans, searchTerm]);

    /*
     * ==========================================
     * PAGINATION
     * ==========================================
     */

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (rows: number) => {
        setRowsPerPage(rows);
        setCurrentPage(1);
    };

    /*
     * ==========================================
     * FORMATTERS
     * ==========================================
     */

    const formatDate = (date: string) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatTime = (date: string) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const formatPrice = (price: string | number) => {
        const numericPrice = Number(price);

        if (Number.isNaN(numericPrice)) {
            return price;
        }

        return numericPrice.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    };

    const formatDuration = (days: number) => {
        if (!days) {
            return "N/A";
        }

        if (days === 1) {
            return "1 day";
        }

        if (days === 30) {
            return "1 month";
        }

        if (days === 365) {
            return "1 year";
        }

        if (days % 30 === 0) {
            return `${days / 30} months`;
        }

        return `${days} days`;
    };

    /*
     * ==========================================
     * CREATOR AVATAR
     * ==========================================
     */

    const getAvatarText = (
        plan: (typeof plans)[number]
    ) => {
        const name =
            plan.creator?.full_name ||
            `${plan.creator?.first_name || ""} ${plan.creator?.last_name || ""}`.trim() ||
            plan.creator?.user_name ||
            "Creator";

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length >= 2) {
            return `${words[0][0]}${words[1][0]}`.toUpperCase();
        }

        return words[0]
            ?.slice(0, 2)
            .toUpperCase() || "CR";
    };

    /*
     * ==========================================
     * FEATURES
     * ==========================================
     */

    const formatFeatureValue = (
        feature: (typeof plans)[number]["features"][number]
    ) => {
        if (feature.feature_type === "boolean") {
            return feature.feature_value === "true"
                ? "Yes"
                : "No";
        }

        return feature.feature_value || "N/A";
    };

    /*
     * ==========================================
     * EXPORT CSV
     * ==========================================
     */

    const handleExport = () => {
        if (!filteredPlans.length) {
            toast.info("No creator plans available to export");
            return;
        }

        const headers = [
            "Plan Name",
            "Creator",
            "Username",
            "Email",
            "Price",
            "Duration",
            "Features",
            "Description",
            "Status",
            "Created At",
        ];

        const rows = filteredPlans.map((plan) => {
            const creatorName =
                plan.creator?.full_name ||
                `${plan.creator?.first_name || ""} ${plan.creator?.last_name || ""}`.trim() ||
                "Unknown";

            const features = plan.features
                ?.map(
                    (feature) =>
                        `${feature.feature_name}: ${formatFeatureValue(feature)}`
                )
                .join(" | ");

            return [
                plan.name || "N/A",
                creatorName,
                plan.creator?.user_name
                    ? `@${plan.creator.user_name.replace(/^@/, "")}`
                    : "N/A",
                plan.creator?.email || "N/A",
                plan.price
                    ? formatPrice(plan.price)
                    : "N/A",
                formatDuration(plan.duration_days),
                features || "N/A",
                plan.description || "N/A",
                plan.is_active
                    ? "Active"
                    : "Inactive",
                plan.createdAt || "N/A",
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value).replace(/"/g, '""')}"`
                    )
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "creator-plans.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success(
            "Creator plans exported successfully"
        );
    };

    /*
     * ==========================================
     * TABLE COLUMNS
     * ==========================================
     */

    const columns = [
        {
            label: "Creator",
            width: "220px",
        },
        {
            label: "Plan",
            width: "160px",
        },
        {
            label: "Price",
            width: "110px",
        },
        {
            label: "Duration",
            width: "120px",
        },
        {
            label: "Description",
            width: "260px",
        },
        {
            label: "Status",
            width: "110px",
        },
        {
            label: "Created At",
            width: "150px",
        },
        {
            label: "Action",
            width: "90px",
            className: "text-center",
        },
    ];

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
                        Creator's Plans
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        Manage and monitor plans created by creators.
                    </p>
                </div>

                <div className="flex w-full items-center gap-3 lg:w-auto">

                    {/* SEARCH */}

                    <div className="w-full lg:w-[305px]">
                        <Search
                            searchTerm={searchInput}
                            setSearchTerm={setSearchInput}
                            placeholder="Search creator ..."
                        />
                    </div>

                    

                </div>
            </div>

            {/* ========================================
                TABLE
            ======================================== */}

            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[1220px] text-left border-collapse">

                        <TableHeader
                            columns={columns}
                            showCheckbox={false}
                        />

                        <tbody className="divide-y divide-[#EAECF0]">

                            {/* LOADING */}

                            {loading ? (

                                <TableSkeleton
                                    rows={rowsPerPage}
                                />

                            ) : filteredPlans.length === 0 ? (

                                /* EMPTY */

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="px-6 py-16 text-center"
                                    >

                                        <div className="flex flex-col items-center justify-center">

                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">

                                                <SearchX
                                                    size={22}
                                                    className="text-[#2563EB]"
                                                />

                                            </div>

                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No creator plans found
                                            </p>

                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                Try changing your search.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                /* DATA */

                                filteredPlans.map(
                                    (plan) => {

                                        const creatorName =
                                            plan.creator?.full_name ||
                                            `${plan.creator?.first_name || ""} ${plan.creator?.last_name || ""}`.trim() ||
                                            "Unknown";

                                        return (
                                            <tr
                                                key={
                                                    plan.plan_id
                                                }
                                                className="transition-colors hover:bg-[#F9FAFB]"
                                            >

                                                {/* ==================================
                                                    CREATOR
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        {plan.creator?.profile_pic ? (

                                                            <img
                                                                src={
                                                                    plan.creator.profile_pic
                                                                }
                                                                alt={
                                                                    creatorName
                                                                }
                                                                className="h-11 w-11 shrink-0 rounded-full border border-gray-200 object-cover"
                                                            />

                                                        ) : (

                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#EFF6FF] text-[13px] font-semibold text-[#2563EB]">
                                                                {getAvatarText(
                                                                    plan
                                                                )}
                                                            </div>

                                                        )}

                                                        <div className="min-w-0">

                                                            <p className="truncate text-[14px] font-semibold text-[#101828]">
                                                                {
                                                                    creatorName
                                                                }
                                                            </p>

                                                            <p className="mt-1 truncate text-[12px] text-[#667085]">
                                                                {plan.creator?.user_name
                                                                    ? `@${plan.creator.user_name.replace(/^@/, "")}`
                                                                    : "N/A"}
                                                            </p>

                                                            <p className="mt-0.5 truncate text-[12px] text-[#98A2B3]">
                                                                {
                                                                    plan.creator?.email
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* ==================================
                                                    PLAN
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <div className="min-w-0">

                                                        <p className="truncate text-[14px] font-semibold text-[#101828]">
                                                            {
                                                                plan.name
                                                            }
                                                        </p>

                                                        <p
                                                            className="mt-1 max-w-[170px] truncate text-[12px] text-[#667085]"
                                                            title={
                                                                plan.slug
                                                            }
                                                        >
                                                            {
                                                                plan.slug
                                                            }
                                                        </p>

                                                    </div>

                                                </td>

                                                {/* ==================================
                                                    PRICE
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <p className="text-[14px] font-semibold text-[#101828]">
                                                        ₹{" "}
                                                        {formatPrice(
                                                            plan.price
                                                        )}
                                                    </p>

                                                </td>

                                                {/* ==================================
                                                    DURATION
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-2">

                                                        <CalendarDays
                                                            size={15}
                                                            className="shrink-0 text-[#98A2B3]"
                                                        />

                                                        <span className="text-[13px] font-medium text-[#475467]">
                                                            {formatDuration(
                                                                plan.duration_days
                                                            )}
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* ==================================
                                                    DESCRIPTION
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <p
                                                        className="max-w-[250px] truncate text-[13px] leading-5 text-[#475467]"
                                                        title={
                                                            plan.description
                                                        }
                                                    >
                                                        {
                                                            plan.description ||
                                                            "N/A"
                                                        }
                                                    </p>

                                                </td>

                                                {/* ==================================
                                                    STATUS
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <Tags
                                                        text={
                                                            plan.is_active
                                                                ? "Active"
                                                                : "Inactive"
                                                        }
                                                        variant={
                                                            plan.is_active
                                                                ? "green"
                                                                : "gray"
                                                        }
                                                    />

                                                </td>

                                                {/* ==================================
                                                    CREATED AT
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <DateTime
                                                        date={formatDate(
                                                            plan.createdAt
                                                        )}
                                                        time={formatTime(
                                                            plan.createdAt
                                                        )}
                                                    />

                                                </td>

                                                {/* ==================================
                                                    ACTION
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <Action
                                                        showView
                                                        showEdit={false}
                                                        showDelete={false}
                                                        onView={() =>
                                                            setSelectedPlan(
                                                                plan
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
                pagination &&
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
                PLAN DETAILS MODAL
            ======================================== */}

            {selectedPlan && (

                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
                    onClick={() =>
                        setSelectedPlan(null)
                    }
                >

                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="flex items-start justify-between border-b border-[#EAECF0] px-6 py-5">

                            <div>

                                <h2 className="text-[20px] font-semibold text-[#101828]">
                                    {
                                        selectedPlan.name
                                    }
                                </h2>

                                <p className="mt-1 text-[13px] text-[#667085]">
                                    Creator plan details
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedPlan(
                                        null
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-[#667085] hover:bg-gray-100"
                            >
                                ×
                            </button>

                        </div>

                        {/* MODAL BODY */}

                        <div className="space-y-6 px-6 py-6">

                            {/* CREATOR */}

                            <div>

                                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#98A2B3]">
                                    Creator
                                </p>

                                <div className="flex items-center gap-3">

                                    {selectedPlan.creator?.profile_pic ? (

                                        <img
                                            src={
                                                selectedPlan.creator.profile_pic
                                            }
                                            alt={
                                                selectedPlan.creator.full_name ||
                                                "Creator"
                                            }
                                            className="h-12 w-12 rounded-full border border-gray-200 object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-semibold text-[#2563EB]">
                                            {getAvatarText(
                                                selectedPlan
                                            )}
                                        </div>

                                    )}

                                    <div>

                                        <p className="text-[14px] font-semibold text-[#101828]">
                                            {
                                                selectedPlan.creator?.full_name ||
                                                "Unknown"
                                            }
                                        </p>

                                        <p className="text-[12px] text-[#667085]">
                                            {selectedPlan.creator?.user_name
                                                ? `@${selectedPlan.creator.user_name.replace(/^@/, "")}`
                                                : "N/A"}
                                        </p>

                                        <p className="text-[12px] text-[#98A2B3]">
                                            {
                                                selectedPlan.creator?.email
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* PLAN INFO */}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                                <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-4">

                                    <p className="text-[12px] text-[#667085]">
                                        Price
                                    </p>

                                    <p className="mt-1 text-[18px] font-semibold text-[#101828]">
                                        ₹{" "}
                                        {formatPrice(
                                            selectedPlan.price
                                        )}
                                    </p>

                                </div>

                                <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-4">

                                    <p className="text-[12px] text-[#667085]">
                                        Duration
                                    </p>

                                    <p className="mt-1 text-[16px] font-semibold text-[#101828]">
                                        {formatDuration(
                                            selectedPlan.duration_days
                                        )}
                                    </p>

                                </div>

                                <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-4">

                                    <p className="text-[12px] text-[#667085]">
                                        Status
                                    </p>

                                    <div className="mt-2">

                                        <Tags
                                            text={
                                                selectedPlan.is_active
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                            variant={
                                                selectedPlan.is_active
                                                    ? "green"
                                                    : "gray"
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* DESCRIPTION */}

                            <div>

                                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#98A2B3]">
                                    Description
                                </p>

                                <p className="text-[14px] leading-6 text-[#475467]">
                                    {
                                        selectedPlan.description ||
                                        "No description available."
                                    }
                                </p>

                            </div>

                            {/* FEATURES */}

                            <div>

                                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#98A2B3]">
                                    Features
                                </p>

                                <div className="space-y-2">

                                    {selectedPlan.features?.length ? (

                                        selectedPlan.features.map(
                                            (feature) => (
                                                <div
                                                    key={
                                                        feature.plan_feature_id
                                                    }
                                                    className="flex items-center justify-between rounded-lg border border-[#EAECF0] px-4 py-3"
                                                >

                                                    <span className="text-[13px] font-medium text-[#344054]">
                                                        {
                                                            feature.feature_name
                                                        }
                                                    </span>

                                                    <span className="text-[13px] font-semibold text-[#101828]">
                                                        {formatFeatureValue(
                                                            feature
                                                        )}
                                                    </span>

                                                </div>
                                            )
                                        )

                                    ) : (

                                        <p className="text-[13px] text-[#98A2B3]">
                                            No features available.
                                        </p>

                                    )}

                                </div>

                            </div>

                            {/* CREATED */}

                            <div className="flex items-center gap-2 border-t border-[#EAECF0] pt-5">

                                <CalendarDays
                                    size={16}
                                    className="text-[#98A2B3]"
                                />

                                <span className="text-[13px] text-[#667085]">
                                    Created on
                                </span>

                                <span className="text-[13px] font-medium text-[#344054]">
                                    {formatDate(
                                        selectedPlan.createdAt
                                    )}
                                </span>

                            </div>

                        </div>

                        {/* MODAL FOOTER */}

                        <div className="flex justify-end border-t border-[#EAECF0] px-6 py-4">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedPlan(
                                        null
                                    )
                                }
                                className="rounded-lg border border-[#D0D5DD] bg-white px-4 py-2 text-[13px] font-semibold text-[#344054] hover:bg-gray-50"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default CreatorPlans;