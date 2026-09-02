"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    X,
    Gift as GiftIcon,
    Upload,
} from "lucide-react";
import type {
    Gift,
    UpdateGiftPayload,
} from "@/types/GiftsTypes/gifts.types";

import { toast } from "react-toastify";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    editGift,
} from "@/store/slices/GiftsSlices/giftsSlice";

import {
    fetchGiftCategories,
} from "@/store/slices/GiftsSlices/giftCategorySlice";

import CustomSelect from "@/components/common/CustomSelect";


interface EditGiftModalProps {
    isOpen: boolean;
    gift: Gift;
    onClose: () => void;
    onSuccess?: () => void;
}

const EditGiftModal = ({
    isOpen,
    gift,
    onClose,
    onSuccess,
}: EditGiftModalProps) => {

    const dispatch = useAppDispatch();

    const {
        updateLoading,
    } = useAppSelector(
        (state) => state.gifts
    );

    const {
        giftCategories,
        loading: categoryLoading,
    } = useAppSelector(
        (state) =>
            state.giftCategories
    );


    const [name, setName] =
        useState("");

    const [giftValue, setGiftValue] =
        useState("");

    const [imageFile, setImageFile] =
        useState<File | null>(null);

    const [imagePreview, setImagePreview] =
        useState("");

    const [isDragging, setIsDragging] =
        useState(false);

    const fileInputRef =
        useRef<HTMLInputElement | null>(null);

    const [
        giftCategoryId,
        setGiftCategoryId,
    ] = useState<number | null>(null);


    const [errors, setErrors] =
        useState<{
            name?: string;
            giftValue?: string;
            giftCategoryId?: string;
            image?: string;
        }>({});

    /*
     * ==========================================
     * LOAD GIFT
     * ==========================================
     */

    useEffect(() => {

        if (!gift) {
            return;
        }

        setName(
            gift.name || ""
        );

        setGiftValue(
            gift.gift_value !==
                undefined &&
                gift.gift_value !==
                null
                ? String(
                    gift.gift_value
                )
                : ""
        );

        setImagePreview(
            gift.gift_thumbnail ||
            ""
        );

        setImageFile(null);
        setGiftCategoryId(
            gift.gift_category_id ??
            gift.category
                ?.gift_category_id ??
            null
        );

        setErrors({});

    }, [gift]);


    /*
     * ==========================================
     * FETCH CATEGORIES
     * ==========================================
     */

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        dispatch(
            fetchGiftCategories({
                page: 1,
                pageSize: 100,
                name: "",
            })
        );

    }, [
        isOpen,
        dispatch,
    ]);


    /*
     * ==========================================
     * RESET
     * ==========================================
     */

    const resetForm = () => {

        setName("");

        setGiftValue("");

        setImageFile(null);

        setImagePreview("");

        setIsDragging(false);

        setGiftCategoryId(null);

        setErrors({});

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    const handleImageSelect = (file: File | null) => {

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            setErrors((prev) => ({
                ...prev,
                image: "Please select a valid image file.",
            }));

            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {

            setErrors((prev) => ({
                ...prev,
                image: "Image size must be less than 5MB.",
            }));

            return;
        }

        setImageFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);

        setErrors((prev) => ({
            ...prev,
            image: undefined,
        }));
    };


    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            e.target.files?.[0] || null;

        handleImageSelect(file);
    };


    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>
    ) => {

        e.preventDefault();

        setIsDragging(false);

        if (updateLoading) {
            return;
        }

        const file =
            e.dataTransfer.files?.[0] || null;

        handleImageSelect(file);
    };


    const removeImage = () => {

        setImageFile(null);

        setImagePreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /*
     * ==========================================
     * CLOSE
     * ==========================================
     */

    const handleClose = () => {

        if (updateLoading) {
            return;
        }

        resetForm();

        onClose();
    };


    /*
     * ==========================================
     * VALIDATION
     * ==========================================
     */

    const validate = () => {

        const newErrors: {
            name?: string;
            giftValue?: string;
            giftCategoryId?: string;
            image?: string;
        } = {};


        if (!name.trim()) {

            newErrors.name =
                "Gift name is required.";

        }


        if (!giftValue.trim()) {

            newErrors.giftValue =
                "Gift value is required.";

        } else if (
            Number.isNaN(
                Number(giftValue)
            ) ||
            Number(giftValue) <= 0
        ) {

            newErrors.giftValue =
                "Gift value must be greater than 0.";

        }


        if (
            giftCategoryId === null
        ) {

            newErrors.giftCategoryId =
                "Gift category is required.";

        }


        setErrors(
            newErrors
        );

        return (
            Object.keys(
                newErrors
            ).length === 0
        );
    };


    /*
     * ==========================================
     * SUBMIT
     * ==========================================
     */

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (!validate()) {
            return;
        }


        try {

            const payload: UpdateGiftPayload = {
                name: name.trim(),

                gift_value: Number(giftValue),

                gift_category_id: giftCategoryId as number,

                ...(imageFile
                    ? {
                        file_media_1: imageFile,
                    }
                    : {}),
            };

            const result =
                await dispatch(
                    editGift({
                        giftId:
                            gift.gift_id,

                        payload,
                    })
                ).unwrap();


            if (result.status) {

                toast.success(
                    result.message ||
                    "Gift updated successfully"
                );

                resetForm();

                onClose();

                onSuccess?.();

            } else {

                toast.error(
                    result.message ||
                    "Failed to update gift"
                );

            }

        } catch (error) {

            toast.error(
                typeof error === "string"
                    ? error
                    : "Failed to update gift"
            );

        }
    };


    if (!isOpen) {
        return null;
    }


    /*
     * ==========================================
     * CATEGORY OPTIONS
     * ==========================================
     */

    const categoryOptions =
        giftCategories.map(
            (category) => ({
                label:
                    category.name,

                value:
                    String(
                        category.gift_category_id
                    ),
            })
        );


    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
            onMouseDown={(e) => {

                if (
                    e.target ===
                    e.currentTarget &&
                    !updateLoading
                ) {

                    handleClose();

                }

            }}
        >

            <div className="w-full max-w-[520px] overflow-visible rounded-[12px] bg-white shadow-2xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-[#EAECF0] px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EEF4FF]">

                            <GiftIcon
                                size={20}
                                className="text-[#2563EB]"
                            />

                        </div>

                        <div>

                            <h2 className="text-[18px] font-semibold text-[#101828]">
                                Edit Gift
                            </h2>

                            <p className="mt-0.5 text-[13px] text-[#667085]">
                                Update gift details.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        disabled={
                            updateLoading
                        }
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#667085] hover:bg-[#F2F4F7] disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <X size={19} />

                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="space-y-5 px-6 py-6">

                        {/* NAME */}

                        <div>

                            <label
                                htmlFor="edit-gift-name"
                                className="mb-1.5 block text-[13px] font-medium text-[#344054]"
                            >
                                Gift Name

                                <span className="ml-1 text-red-500">
                                    *
                                </span>

                            </label>


                            <input
                                id="edit-gift-name"
                                type="text"
                                value={name}
                                onChange={(e) => {

                                    setName(
                                        e.target.value
                                    );

                                    if (
                                        errors.name
                                    ) {

                                        setErrors(
                                            (prev) => ({
                                                ...prev,
                                                name: undefined,
                                            })
                                        );

                                    }

                                }}
                                placeholder="Enter gift name"
                                maxLength={100}
                                disabled={
                                    updateLoading
                                }
                                className={`h-[42px] w-full rounded-[8px] border bg-white px-3 text-[14px] text-[#101828] outline-none placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:bg-[#F9FAFB] ${errors.name
                                    ? "border-red-500"
                                    : "border-[#D0D5DD] focus:border-[#2563EB]"
                                    }`}
                            />


                            {errors.name && (

                                <p className="mt-1.5 text-[12px] text-red-500">
                                    {errors.name}
                                </p>

                            )}

                        </div>


                        {/* CATEGORY */}

                        <div>

                            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">

                                Gift Category

                                <span className="ml-1 text-red-500">
                                    *
                                </span>

                            </label>


                            <CustomSelect
                                options={
                                    categoryOptions
                                }
                                value={
                                    giftCategoryId !== null
                                        ? String(
                                            giftCategoryId
                                        )
                                        : ""
                                }
                                onChange={(
                                    value: string
                                ) => {

                                    setGiftCategoryId(
                                        Number(
                                            value
                                        )
                                    );

                                    if (
                                        errors.giftCategoryId
                                    ) {

                                        setErrors(
                                            (prev) => ({
                                                ...prev,
                                                giftCategoryId:
                                                    undefined,
                                            })
                                        );

                                    }

                                }}
                                placeholder={
                                    categoryLoading
                                        ? "Loading categories..."
                                        : "Select Category"
                                }
                                disabled={
                                    updateLoading ||
                                    categoryLoading
                                }
                            />


                            {errors.giftCategoryId && (

                                <p className="mt-1.5 text-[12px] text-red-500">
                                    {
                                        errors.giftCategoryId
                                    }
                                </p>

                            )}

                        </div>


                        {/* VALUE */}

                        <div>

                            <label
                                htmlFor="edit-gift-value"
                                className="mb-1.5 block text-[13px] font-medium text-[#344054]"
                            >
                                Gift Value

                                <span className="ml-1 text-red-500">
                                    *
                                </span>

                            </label>


                            <input
                                id="edit-gift-value"
                                type="number"
                                value={
                                    giftValue
                                }
                                onChange={(e) => {

                                    setGiftValue(
                                        e.target.value
                                    );

                                    if (
                                        errors.giftValue
                                    ) {

                                        setErrors(
                                            (prev) => ({
                                                ...prev,
                                                giftValue:
                                                    undefined,
                                            })
                                        );

                                    }

                                }}
                                placeholder="Enter gift value"
                                min="1"
                                step="1"
                                disabled={
                                    updateLoading
                                }
                                className={`h-[42px] w-full rounded-[8px] border bg-white px-3 text-[14px] text-[#101828] outline-none placeholder:text-[#98A2B3] disabled:cursor-not-allowed disabled:bg-[#F9FAFB] ${errors.giftValue
                                    ? "border-red-500"
                                    : "border-[#D0D5DD] focus:border-[#2563EB]"
                                    }`}
                            />


                            {errors.giftValue && (

                                <p className="mt-1.5 text-[12px] text-red-500">
                                    {
                                        errors.giftValue
                                    }
                                </p>

                            )}

                        </div>


                        {/* IMAGE */}

                        {/* IMAGE */}
                        <div>

                            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
                                Gift Image

                                <span className="ml-1 text-[11px] font-normal text-[#98A2B3]">
                                    (Optional)
                                </span>
                            </label>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={updateLoading}
                            />

                            {!imagePreview ? (

                                <div
                                    onClick={() => {
                                        if (!updateLoading) {
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();

                                        if (!updateLoading) {
                                            setIsDragging(true);
                                        }
                                    }}
                                    onDragLeave={() => {
                                        setIsDragging(false);
                                    }}
                                    onDrop={handleDrop}
                                    className={`
                flex min-h-[130px] cursor-pointer
                flex-col items-center justify-center
                rounded-[8px] border border-dashed
                bg-white px-4 py-5
                transition-colors
                ${isDragging
                                            ? "border-[#2563EB] bg-[#EFF6FF]"
                                            : errors.image
                                                ? "border-red-500"
                                                : "border-[#D0D5DD] hover:border-[#2563EB] hover:bg-[#F9FAFB]"
                                        }
                ${updateLoading
                                            ? "cursor-not-allowed opacity-60"
                                            : ""
                                        }
            `}
                                >

                                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF]">

                                        <Upload
                                            size={19}
                                            className="text-[#2563EB]"
                                        />

                                    </div>

                                    <p className="text-[13px] font-medium text-[#344054]">
                                        Drop your image here or click to browse
                                    </p>

                                    <p className="mt-1 text-[11px] text-[#98A2B3]">
                                        PNG, JPG, JPEG, WEBP up to 5MB
                                    </p>

                                </div>

                            ) : (

                                <div className="relative overflow-hidden rounded-[8px] border border-[#D0D5DD] bg-[#F9FAFB]">

                                    <div className="flex items-center gap-4 p-3">

                                        <img
                                            src={imagePreview}
                                            alt="Gift preview"
                                            className="h-[72px] w-[72px] rounded-[8px] object-cover"
                                        />

                                        <div className="min-w-0 flex-1">

                                            <p className="truncate text-[13px] font-medium text-[#344054]">
                                                {imageFile?.name || "Current gift image"}
                                            </p>

                                            {imageFile && (
                                                <p className="mt-1 text-[11px] text-[#98A2B3]">
                                                    {(
                                                        imageFile.size / 1024
                                                    ).toFixed(1)} KB
                                                </p>
                                            )}

                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                disabled={updateLoading}
                                                className="mt-2 cursor-pointer text-[12px] font-medium text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Remove image
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )}

                            {errors.image && (

                                <p className="mt-1.5 text-[12px] text-red-500">
                                    {errors.image}
                                </p>

                            )}

                        </div>

                    </div>


                    {/* FOOTER */}

                    <div className="flex items-center justify-end gap-3 border-t border-[#EAECF0] px-6 py-4">

                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            disabled={
                                updateLoading
                            }
                            className="h-[40px] cursor-pointer rounded-[8px] border border-[#D0D5DD] bg-white px-4 text-[13px] font-semibold text-[#344054] hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                updateLoading
                            }
                            className="flex h-[40px] min-w-[120px] cursor-pointer items-center justify-center rounded-[8px] bg-[#2563EB] px-4 text-[13px] font-semibold text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {updateLoading ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                    Updating...

                                </>
                            ) : (
                                "Update Gift"
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditGiftModal;