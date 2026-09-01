import { Trash } from "lucide-react";


interface DeleteModalProps {
    onClose: () => void;
    onConfirm: () => void;

    title?: string;
    message?: string;
    confirmText?: string;

    loading?: boolean; // ADD
}
export default function CategoriesDeleteModal({
    onClose,
    onConfirm,

    title = "Are you sure want to delete ?",
    message = "This Item will be deleted Permanently. You can not undo this action.",
    confirmText = "Delete",

    loading = false, // ADD
}: DeleteModalProps) {

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 theme-container">

            <div className="bg-white rounded-xl p-9 max-w-[480px] w-full mx-4 shadow-xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">

                <div className="w-16 h-16 bg-[#f1f1f1] rounded-full flex items-center justify-center mb-4">
                    <Trash
                        className="w-8 h-8 text-gray-400"
                        strokeWidth={1.5}
                    />
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-wide">
                    {title}
                </h3>

                <p className="text-gray-500 text-md font-semiibold mb-8 leading-relaxed tracking-wider">
                    {message}
                </p>

                <div className="flex gap-4 w-full">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-6 py-2.5 rounded-xl bg-[#f1f1f1] text-gray-600 font-bold hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 rounded-xl bg-red-600 px-6 py-2.5 font-bold text-white transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Deleting..." : confirmText}
                    </button>

                </div>
            </div>
        </div>
    );
}