"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Percent } from "lucide-react";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    createPlatformFee,
    editPlatformFee,
    fetchPlatformFeeByType,
    clearAddFeeState,
    clearUpdateFeeState,
    clearSelectedFee,
} from "@/store/slices/FeesSlices/feesSlice";

import type { FeeType, FeeStatus } from "@/types/FeesTypes/fees.types";

import CustomSelect from "@/components/common/CustomSelect";
import Button from "@/components/common/Button";


const FEE_TYPE_OPTIONS = [
    { value: "subscription", label: "Subscription" },
    { value: "post_support", label: "Post Support" },
    { value: "live_gift_support", label: "Live Gift Support" },
    { value: "profile_support", label: "Profile Support" },
    { value: "campaign_support", label: "Campaign Support" },
];

const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];


const AddFeeType = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const feeTypeParam = searchParams.get("fee_type");
    const isEdit = Boolean(feeTypeParam);

    const {
        addLoading, addError, addSuccess,
        updateLoading, updateError, updateSuccess,
        selectedFee, selectedFeeLoading, selectedFeeError,
    } = useAppSelector((state) => state.fees);

    const loading = isEdit ? updateLoading : addLoading;
    const apiError = isEdit ? updateError : addError;

    const [feeType, setFeeType] = useState("");
    const [feePercentage, setFeePercentage] = useState("");
    const [status, setStatus] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});


    /*
     * ==========================================
     * FETCH FOR EDIT
     * ==========================================
     */

    useEffect(() => {
        if (isEdit && feeTypeParam) {
            dispatch(fetchPlatformFeeByType(feeTypeParam));
        }
        return () => {
            dispatch(clearSelectedFee());
            dispatch(clearAddFeeState());
            dispatch(clearUpdateFeeState());
        };
    }, [dispatch, isEdit, feeTypeParam]);


    useEffect(() => {
        if (selectedFee) {
            setFeeType(selectedFee.fee_type);
            setFeePercentage(selectedFee.fee_percentage);
            setStatus(selectedFee.status);
        }
    }, [selectedFee]);


    /*
     * ==========================================
     * REDIRECT ON SUCCESS
     * ==========================================
     */

    useEffect(() => {
        if (addSuccess || updateSuccess) {
            dispatch(clearAddFeeState());
            dispatch(clearUpdateFeeState());
            router.push("/fees/fees-type-list");
        }
    }, [addSuccess, updateSuccess, dispatch, router]);


    /*
     * ==========================================
     * VALIDATION
     * ==========================================
     */

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!feeType) newErrors.feeType = "Fee type is required.";

        const parsed = parseFloat(feePercentage);
        if (!feePercentage) {
            newErrors.feePercentage = "Fee percentage is required.";
        } else if (Number.isNaN(parsed) || parsed <= 0 || parsed > 100) {
            newErrors.feePercentage = "Enter a valid percentage between 0 and 100.";
        }

        if (!status) newErrors.status = "Status is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    /*
     * ==========================================
     * SUBMIT
     * ==========================================
     */

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            fee_type: feeType as FeeType,
            fee_percentage: parseFloat(feePercentage),
            status: status as FeeStatus,
        };

        if (isEdit) {
            dispatch(editPlatformFee(payload));
        } else {
            dispatch(createPlatformFee(payload));
        }
    };


    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                BACK
            ======================================== */}

            <button
                type="button"
                onClick={() => router.back()}
                className="mb-5 flex items-center gap-1.5 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]"
            >
                <ArrowLeft size={15} />
                Back to Fee Type List
            </button>


            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-6">
                <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#101828]">
                    {isEdit ? "Edit Fee Type" : "Add Fee Type"}
                </h1>
                <p className="mt-1 text-[13.5px] text-[#667085]">
                    {isEdit
                        ? "Update the fee percentage and status for this fee type."
                        : "Create a new platform fee type with percentage and status."}
                </p>
            </div>


            {/* ========================================
                FORM CARD
            ======================================== */}

            <div className="overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)]">

                {/* Card Header */}
                <div className="flex items-center gap-3 border-b border-[#EAECF0] bg-[#FAFAFA] px-6 py-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                        <Percent size={16} />
                    </span>
                    <div>
                        <h3 className="text-[13.5px] font-semibold text-[#101828]">
                            Fee Details
                        </h3>
                        <p className="mt-0.5 text-[11.5px] text-[#98A2B3]">
                            {isEdit
                                ? "Modify the fee percentage and status below."
                                : "Fill in the details for the new fee type."}
                        </p>
                    </div>
                </div>


                {/* Fetch error (edit mode) */}
                {selectedFeeError && (
                    <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                        {selectedFeeError}
                    </div>
                )}

                {/* API error */}
                {apiError && (
                    <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                        {apiError}
                    </div>
                )}


                {/* Loading skeleton for edit fetch */}
                {isEdit && selectedFeeLoading ? (

                    <div className="space-y-4 px-6 py-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-10 animate-pulse rounded-lg bg-[#EAECF0]" />
                        ))}
                    </div>

                ) : (

                    <form onSubmit={handleSubmit} className="px-6 py-6">

                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">

                            {/* FEE TYPE */}
                            <div>
                                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#667085]">
                                    Fee Type
                                </label>
                                <CustomSelect
                                    value={feeType}
                                    onChange={(val) => {
                                        setFeeType(val);
                                        setErrors((prev) => ({ ...prev, feeType: "" }));
                                    }}
                                    options={FEE_TYPE_OPTIONS}
                                    placeholder="Select fee type"
                                    searchable={false}
                                    error={Boolean(errors.feeType)}
                                    disabled={isEdit}
                                />
                                {errors.feeType && (
                                    <p className="mt-1 text-[12px] text-red-500">{errors.feeType}</p>
                                )}
                                {isEdit && (
                                    <p className="mt-1 text-[11px] text-[#98A2B3]">
                                        Fee type cannot be changed after creation.
                                    </p>
                                )}
                            </div>


                            {/* FEE PERCENTAGE */}
                            <div>
                                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#667085]">
                                    Fee Percentage
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={feePercentage}
                                        onChange={(e) => {
                                            setFeePercentage(e.target.value);
                                            setErrors((prev) => ({ ...prev, feePercentage: "" }));
                                        }}
                                        placeholder="e.g. 10.00"
                                        className={`w-full rounded-[8px] border py-2.5 pl-3 pr-10 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 ${
                                            errors.feePercentage
                                                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                : "border-gray-300 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                                        }`}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                                        <Percent size={14} />
                                    </span>
                                </div>
                                {errors.feePercentage && (
                                    <p className="mt-1 text-[12px] text-red-500">{errors.feePercentage}</p>
                                )}
                            </div>


                            {/* STATUS */}
                            <div>
                                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#667085]">
                                    Status
                                </label>
                                <CustomSelect
                                    value={status}
                                    onChange={(val) => {
                                        setStatus(val);
                                        setErrors((prev) => ({ ...prev, status: "" }));
                                    }}
                                    options={STATUS_OPTIONS}
                                    placeholder="Select status"
                                    searchable={false}
                                    error={Boolean(errors.status)}
                                />
                                {errors.status && (
                                    <p className="mt-1 text-[12px] text-red-500">{errors.status}</p>
                                )}
                            </div>

                        </div>


                        {/* SUBMIT */}
                        <div className="mt-8 flex justify-end border-t border-[#EAECF0] pt-6">
                            <Button
                                type="submit"
                                loading={loading}
                                disabled={loading}
                                className="w-auto px-10"
                            >
                                {isEdit ? "Update Fee Type" : "Add Fee Type"}
                            </Button>
                        </div>

                    </form>

                )}

            </div>

        </div>
    );
};

export default AddFeeType;
