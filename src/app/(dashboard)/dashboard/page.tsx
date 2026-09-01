"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  UserCheck,
  Crown,
  IndianRupee,
} from "lucide-react";

import type {
  AppDispatch,
  RootState,
} from "@/store/store";

import {
  fetchDashboardStats,
} from "@/store/slices/DashboardSlices/dashboardSlice";

import StatsCards from "@/components/common/StatsCard";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    stats,
    loading,
    error,
  } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  const formatRevenue = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const dashboardStats = [
    {
      label: "Total Users",
      value: formatNumber(stats.total_users),
      icon: <Users size={28} className="text-violet-600" />,
      bg: "bg-violet-50",
    },
    {
      label: "Active Users",
      value: formatNumber(stats.active_users),
      icon: <UserCheck size={28} className="text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Total Creators",
      value: formatNumber(stats.total_creators),
      icon: <Crown size={28} className="text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      label: "Total Revenue",
      value: formatRevenue(stats.total_revenue),
      icon: <IndianRupee size={28} className="text-orange-600" />,
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-[#101828] md:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-[15px] text-[#667085]">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Dashboard Stats */}
      <StatsCards
        stats={dashboardStats}
        cols={4}
        loading={loading}
      />
    </div>
  );
};

export default DashboardPage;