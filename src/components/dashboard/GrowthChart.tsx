"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import CustomSelect from "@/components/common/CustomSelect";

export interface GrowthChartData {
    date: string;
    value: number;
}

interface GrowthChartProps {
    title: string;
    data: GrowthChartData[];
    loading?: boolean;
    period: "today" | "week" | "month";
    onPeriodChange: (
        period: "today" | "week" | "month"
    ) => void;
}
const growthPeriodOptions = [
    {
        value: "today",
        label: "Today",
    },
    {
        value: "week",
        label: "Week",
    },
    {
        value: "month",
        label: "Month",
    },
];
const GrowthChart = ({
    title,
    data,
    loading = false,
    period,
    onPeriodChange,
}: GrowthChartProps) => {
    const formatDate = (date: string) => {
        if (!date) return "";

        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "numeric",
        });
    };

    const formattedData = data.map((item) => ({
        ...item,
        displayDate: formatDate(item.date),
    }));

    return (
        <div className="rounded-[14px] border border-[#EAECF0] bg-white p-5 md:p-6">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-[20px] font-semibold text-[#101828]">
                    {title}
                </h2>

                <div className="w-[100px] shrink-0">
                    <CustomSelect
                        value={period}
                        onChange={(value) =>
                            onPeriodChange(
                                value as "today" | "week" | "month"
                            )
                        }
                        options={growthPeriodOptions}
                        searchable={false}
                    />
                </div>
            </div>

            {/* Chart */}
            <div className="h-[300px] w-full">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-[#667085]">
                            Loading...
                        </p>
                    </div>
                ) : formattedData.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-[#667085]">
                            No data available
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart
                            data={formattedData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="0"
                                vertical={false}
                                stroke="#F2F4F7"
                            />

                            <XAxis
                                dataKey="displayDate"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#667085",
                                    fontSize: 12,
                                }}
                            />

                            <YAxis
                                allowDecimals={false}
                                axisLine={false}
                                tickLine={false}
                                width={30}
                                tick={{
                                    fill: "#667085",
                                    fontSize: 12,
                                }}
                            />

                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #EAECF0",
                                    boxShadow:
                                        "0 4px 12px rgba(16, 24, 40, 0.08)",
                                }}
                                labelStyle={{
                                    color: "#101828",
                                    fontWeight: 600,
                                }}
                            />

                            <Line
                                type="linear"
                                dataKey="value"
                                stroke="#246BFD"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{
                                    r: 4,
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default GrowthChart;