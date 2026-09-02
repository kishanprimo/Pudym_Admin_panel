"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
    addGiftCategory,
    clearCreateGiftCategoryError,
} from "@/store/slices/GiftsSlices/giftCategorySlice";

interface AddGiftCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddGiftCategoryModal = ({
    isOpen,
    onClose,
    onSuccess,
}: AddGiftCategoryModalProps) => {

    const dispatch = useAppDispatch();

    const {
        createLoading,
        createError,
    } = useAppSelector(
        (state) => state.giftCategories
    );

    const [name, setName] = useState("");

    useEffect(() => {
        if (isOpen) {
            setName("");

            dispatch(
                clearCreateGiftCategoryError()
            );
        }
    }, [isOpen, dispatch]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            return;
        }

        const result = await dispatch(
            addGiftCategory({
                name: trimmedName,
            })
        );

        if (
            addGiftCategory.fulfilled.match(result) &&
            result.payload.status
        ) {
            onClose();

            onSuccess?.();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">

            <div className="w-full max-w-[500px] rounded-xl bg-white shadow-xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-[#EAECF0] px-6 py-5">

                    <div>
                        <h2 className="text-[18px] font-semibold text-[#101828]">
                            Add Gift Category
                        </h2>

                        <p className="mt-1 text-[13px] text-[#667085]">
                            Create a new gift category.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#667085] hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="px-6 py-6"
                >

                    <div>

                        <label className="mb-2 block text-[13px] font-medium text-[#344054]">
                            Category Name
                        </label>

                        <input
                            autoFocus
                            type="text"
                            value={name}
                            maxLength={100}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Enter category name"
                            className="h-[42px] w-full rounded-lg border border-[#D0D5DD] px-3 text-[14px] text-[#101828] outline-none transition focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                        />

                    </div>

                    {createError && (
                        <p className="mt-2 text-[12px] text-red-500">
                            {createError}
                        </p>
                    )}


                    {/* FOOTER */}

                    <div className="mt-7 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={createLoading}
                            className="h-[40px] rounded-lg border border-[#D0D5DD] px-4 text-[13px] font-semibold text-[#344054] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                createLoading ||
                                !name.trim()
                            }
                            className="h-[40px] rounded-lg bg-[#101828] px-5 text-[13px] font-semibold text-white hover:bg-[#1D2939] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {createLoading
                                ? "Adding..."
                                : "Add Category"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddGiftCategoryModal;