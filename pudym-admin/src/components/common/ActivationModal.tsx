"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

interface ActivationModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
    actionLabel: string;
    placeholder?: string;
    loading?: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const ActivationModal = ({
    isOpen,
    title,
    description,
    actionLabel,
    placeholder = "Enter reason...",
    loading = false,
    onClose,
    onConfirm,
}: ActivationModalProps) => {
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (isOpen) {
            setReason("");
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        const trimmedReason = reason.trim();

        if (!trimmedReason || loading) {
            return;
        }

        onConfirm(trimmedReason);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[500px] overflow-hidden rounded-[14px] bg-white shadow-xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-[#EAECF0] px-6 py-5">

                    <div>
                        <h2 className="text-[18px] font-semibold text-[#101828]">
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1 text-[13px] leading-5 text-[#667085]">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-8 w-8 items-center justify-center rounded-[7px] text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-[#101828] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* BODY */}

                <div className="px-6 py-5">

                    <label
                        htmlFor="activation-reason"
                        className="mb-2 block text-[13px] font-semibold text-[#344054]"
                    >
                        Reason
                    </label>

                    <textarea
                        id="activation-reason"
                        value={reason}
                        onChange={(event) =>
                            setReason(event.target.value)
                        }
                        placeholder={placeholder}
                        disabled={loading}
                        rows={4}
                        className="w-full resize-none rounded-[8px] border border-[#D0D5DD] px-3 py-2.5 text-[13px] text-[#344054] outline-none transition-all placeholder:text-[#98A2B3] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 disabled:cursor-not-allowed disabled:bg-[#F9FAFB]"
                    />

                    {!reason.trim() && (
                        <p className="mt-2 text-[12px] text-[#98A2B3]">
                            A reason is required to continue.
                        </p>
                    )}

                </div>

                {/* FOOTER */}

                <div className="flex justify-end gap-3 border-t border-[#EAECF0] px-6 py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="h-[40px] rounded-[8px] border border-[#D0D5DD] bg-white px-4 text-[13px] font-semibold text-[#344054] transition-colors hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!reason.trim() || loading}
                        className="inline-flex h-[40px] items-center justify-center gap-2 rounded-[8px] bg-[#2563EB] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading && (
                            <Loader2
                                size={16}
                                className="animate-spin"
                            />
                        )}

                        {loading ? "Updating..." : actionLabel}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default ActivationModal;