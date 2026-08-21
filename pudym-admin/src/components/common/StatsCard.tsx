import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
interface StatCardItem {
    label: string;
    value: string | number;
    change?: number;
    sub?: string;
    icon: ReactNode;
    bg: string;

    cols?: number;
}

interface StatsCardsProps {
    stats: StatCardItem[];
    cols?: number;
    loading?: boolean;
}

export default function StatsCards({
    stats,
    cols,
    loading = false,
}: StatsCardsProps) {
    const colClass = cols === 3
        ? "2xl:grid-cols-3" :
        cols === 5
            ? "2xl:grid-cols-5"
            : cols === 6
                ? "2xl:grid-cols-6"
                : "2xl:grid-cols-4";

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${colClass} gap-4 mb-6`}>
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className="bg-white p-4 rounded-[10px] border border-gray-200 flex items-center gap-3 min-w-0"
                >
                    <div
                        className={`w-[58px] h-[58px] shrink-0 rounded-[12px] ${stat.bg} flex items-center justify-center`}
                    >
                        {stat.icon}
                    </div>

                    <div className="flex flex-col min-w-0">
                        <p className="text-[14px] font-semibold text-[#344054] truncate font-poppins">
                            {stat.label}
                        </p>

                        {loading ? (
                            <div className="h-7 w-20 bg-gray-200 rounded animate-pulse mt-1" />
                        ) : (
                            <h3 className="text-[24px] font-bold text-[#101828] leading-tight mt-[1px]">
                                {stat.value}
                            </h3>
                        )}

                        {stat.sub ? (
                            <p className="text-[12px] text-gray-500 truncate mt-[1px]">{stat.sub}</p>
                        ) : stat.change !== undefined ? (
                            <div
                                className={`flex items-center gap-1 mt-1 ${stat.change >= 0 ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {stat.change >= 0 ? (
                                    <TrendingUp size={14} />
                                ) : (
                                    <TrendingDown size={14} />
                                )}

                                {loading ? (
                                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                                ) : (
                                    <p className="text-[13px] font-medium">
                                        {Math.abs(stat.change)}% this month
                                    </p>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
}