export default function TableSkeleton({
    rows = 10,
}: {
    rows?: number;
}) {
    return (
        <>
            {Array.from({ length: rows }).map((_, index) => (
                <tr
                    key={index}
                    className="animate-pulse border-b border-gray-100 h-[76px]"
                >
                    {/* Image */}
                    <td className="px-6 py-5">
                        <div className="h-10 w-10 rounded-full bg-gray-200" />
                    </td>

                    {/* User */}
                    <td className="px-6 py-5">
                        <div className="min-w-0">
                            <div className="h-4 w-28 rounded bg-gray-200 mb-2" />
                            <div className="h-3 w-20 rounded bg-gray-100" />
                        </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5">
                        <div className="h-4 w-44 rounded bg-gray-200" />
                    </td>

                    {/* Login Type */}
                    <td className="px-6 py-5">
                        <div className="h-7 w-20 rounded-full bg-gray-200" />
                    </td>

                    {/* Location */}
                    <td className="px-6 py-5">
                        <div className="h-4 w-28 rounded bg-gray-200 mb-2" />
                        <div className="h-3 w-36 rounded bg-gray-100" />
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                        <div className="h-7 w-20 rounded-full bg-gray-200" />
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-5">
                        <div className="h-4 w-24 rounded bg-gray-200 mb-2" />
                        <div className="h-3 w-16 rounded bg-gray-100" />
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-9 w-9 rounded-lg bg-gray-200" />
                            <div className="h-9 w-9 rounded-lg bg-gray-200" />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}