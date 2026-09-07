"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  Users,
  UserCheck,
  Crown,
  IndianRupee,
  Coins,
} from "lucide-react";

import type {
  AppDispatch,
  RootState,
} from "@/store/store";

import {
  fetchDashboardStats,
} from "@/store/slices/DashboardSlices/dashboardSlice";

import {
  fetchUserGrowthReport,
} from "@/store/slices/RevenueGrowthSlices/userGrowthSlice";

import {
  fetchCreatorGrowthReport,
} from "@/store/slices/RevenueGrowthSlices/creatorGrowthSlice";

import GrowthChart from "@/components/dashboard/GrowthChart";
import StatsCards from "@/components/common/StatsCard";
import TableHeader from "@/components/common/TableHeader";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";

type DashboardGrowthPeriod =
  | "today"
  | "week"
  | "month";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const formatDate = (date: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date: string) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getAvatarText = (
    person: {
      full_name?: string;
      first_name?: string;
      last_name?: string;
    },
    fallback: string
  ) => {
    const name =
      person.full_name ||
      `${person.first_name || ""} ${person.last_name || ""}`.trim() ||
      fallback;

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return (
      words[0]?.slice(0, 2).toUpperCase() ||
      fallback.slice(0, 2).toUpperCase()
    );
  };
  const {
    stats,
    loading,
    error,
  } = useSelector(
    (state: RootState) => state.dashboard
  );
  const {
    data: userGrowthData,
    loading: userGrowthLoading,
  } = useSelector(
    (state: RootState) => state.userGrowth
  );

  const {
    data: creatorGrowthData,
    loading: creatorGrowthLoading,
  } = useSelector(
    (state: RootState) => state.creatorGrowth
  );
  const [
    userGrowthPeriod,
    setUserGrowthPeriod,
  ] = useState<DashboardGrowthPeriod>("month");

  const [
    creatorGrowthPeriod,
    setCreatorGrowthPeriod,
  ] = useState<DashboardGrowthPeriod>("month");
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);
  useEffect(() => {
    dispatch(
      fetchUserGrowthReport(userGrowthPeriod)
    );
  }, [dispatch, userGrowthPeriod]);

  useEffect(() => {
    dispatch(
      fetchCreatorGrowthReport(
        creatorGrowthPeriod
      )
    );
  }, [
    dispatch,
    creatorGrowthPeriod,
  ]);
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
    {
      label: "Withdrawal Coins",
      value: formatNumber(stats.total_withdrawal_coins),
      icon: <Coins size={28} className="text-blue-600" />,
      bg: "bg-blue-50",
    },
  ];
  const topUsersColumns = [
    {
      label: "S.L.",
      width: "55px",
    },
    {
      label: "User",
      width: "190px",
    },
    {
      label: "Coins",
      width: "105px",
    },
    {
      label: "Created",
      width: "125px",
    },
    {
      label: "Status",
      width: "115px",
    },
  ];

  const topCreatorsColumns = [
    {
      label: "S.L.",
      width: "55px",
    },
    {
      label: "Creator",
      width: "190px",
    },
    {
      label: "Socials",
      width: "105px",
    },
    {
      label: "Coins",
      width: "110px",
    },
    {
      label: "Created",
      width: "125px",
    },
    {
      label: "Status",
      width: "120px",
    },

  ];
  const userGrowthChart =
    userGrowthData?.chart?.map((item) => ({
      date: item.date,
      value: item.new_users,
    })) || [];

  const creatorGrowthChart =
    creatorGrowthData?.chart?.map((item) => ({
      date: item.date,
      value: item.new_creators,
    })) || [];
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
        cols={5}
        loading={loading}
      />
      {/* Growth Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <GrowthChart
          title="User Growth"
          data={userGrowthChart}
          loading={userGrowthLoading}
          period={userGrowthPeriod}
          onPeriodChange={setUserGrowthPeriod}
        />

        <GrowthChart
          title="Creator Growth"
          data={creatorGrowthChart}
          loading={creatorGrowthLoading}
          period={creatorGrowthPeriod}
          onPeriodChange={setCreatorGrowthPeriod}
        />
      </div>
      {/* Top 5 Users & Top 5 Creators */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">


        {/* ========================================
    TOP 5 USERS
======================================== */}

        <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white">

          {/* TABLE HEADER */}

          <div className="flex items-center justify-between border-b border-[#EAECF0] px-5 py-4 md:px-6">

            <div>
              <h2 className="text-[18px] font-semibold text-[#101828]">
                Top 5 Users
              </h2>

              <p className="mt-1 text-[13px] text-[#667085]">
                Users with the highest available coins.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/AllUsers/userslist")}
              className="shrink-0 text-[13px] font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
            >
              View All →
            </button>

          </div>


          {/* TABLE */}

          <div className="w-full overflow-hidden">

            <table className="w-full table-fixed border-collapse text-left">

              <TableHeader
                columns={topUsersColumns}
                showCheckbox={false}
              />

              <tbody className="divide-y divide-[#EAECF0]">

                {loading ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center"
                    >
                      <p className="text-sm text-[#667085]">
                        Loading...
                      </p>
                    </td>
                  </tr>

                ) : stats.top_users.length === 0 ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center"
                    >
                      <p className="text-sm text-[#667085]">
                        No users available
                      </p>
                    </td>
                  </tr>

                ) : (

                  stats.top_users.map((user, index) => {

                    const isBlocked =
                      user.blocked_by_admin;

                    const isDeactivated =
                      user.is_deactivated;

                    return (
                      <tr
                        key={user.user_id}
                        className="transition-colors hover:bg-[#F9FAFB]"
                      >

                        {/* S.L. */}

                        <td className="pl-8 px-4 py-4">

                          <span className="text-[13px] font-medium text-[#667085]">
                            {index + 1}
                          </span>

                        </td>


                        {/* USER */}

                        <td className="px-4 py-4">

                          <div className="flex min-w-0 items-center gap-3">

                            {user.profile_pic ? (

                              <img
                                src={user.profile_pic}
                                alt={
                                  user.full_name ||
                                  "User"
                                }
                                className="h-9 w-9 shrink-0 rounded-full border border-gray-200 object-cover"
                              />

                            ) : (

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#EFF6FF] text-[11px] font-semibold text-[#2563EB]">
                                {getAvatarText(
                                  user,
                                  "User"
                                )}
                              </div>

                            )}

                            <div className="min-w-0">

                              <p className="truncate text-[13px] font-semibold text-[#101828]">
                                {user.full_name ||
                                  `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                                  "Unknown"}
                              </p>

                              <p className="mt-0.5 truncate text-[11px] text-[#667085]">
                                {user.user_name
                                  ? `@${user.user_name.replace(/^@/, "")}`
                                  : "N/A"}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* COINS */}

                        <td className="px-4 py-4">

                          <p className="text-[13px] font-semibold text-[#344054]">
                            {formatNumber(
                              user.available_coins
                            )}
                          </p>

                        </td>


                        {/* CREATED */}

                        <td className="px-4 py-4">

                          <DateTime
                            date={formatDate(
                              user.createdAt
                            )}
                            time={formatTime(
                              user.createdAt
                            )}
                          />

                        </td>


                        {/* STATUS */}

                        <td className="px-4 py-4">

                          <Tags
                            text={
                              isBlocked
                                ? "Blocked"
                                : isDeactivated
                                  ? "Deactivated"
                                  : "Active"
                            }
                            variant={
                              isBlocked
                                ? "red"
                                : isDeactivated
                                  ? "orange"
                                  : "green"
                            }
                          />

                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </div>




        {/* ========================================
            TOP 5 CREATORS
          ======================================== */}

        <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white">

          {/* TABLE HEADER */}

          <div className="flex items-center justify-between border-b border-[#EAECF0] px-5 py-4 md:px-6">

            <div>
              <h2 className="text-[18px] font-semibold text-[#101828]">
                Top 5 Creators
              </h2>

              <p className="mt-1 text-[13px] text-[#667085]">
                Creators with the highest number of socials.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/creators")}
              className="shrink-0 text-[13px] font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
            >
              View All →
            </button>

          </div>


          {/* TABLE */}

          <div className="w-full overflow-hidden">

            <table className="w-full table-fixed border-collapse text-left">

              <TableHeader
                columns={topCreatorsColumns}
                showCheckbox={false}
              />

              <tbody className="divide-y divide-[#EAECF0]">

                {loading ? (

                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center"
                    >
                      <p className="text-sm text-[#667085]">
                        Loading...
                      </p>
                    </td>
                  </tr>

                ) : stats.top_creators.length === 0 ? (

                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center"
                    >
                      <p className="text-sm text-[#667085]">
                        No creators available
                      </p>
                    </td>
                  </tr>

                ) : (

                  stats.top_creators.map(
                    (creator, index) => {

                      const isBlocked =
                        creator.blocked_by_admin;

                      const isDeactivated =
                        creator.is_deactivated;

                      return (
                        <tr
                          key={creator.user_id}
                          className="transition-colors hover:bg-[#F9FAFB]"
                        >

                          {/* S.L. */}

                          <td className="pl-8 px-4 py-4">

                            <span className="text-[13px] font-medium text-[#667085]">
                              {index + 1}
                            </span>

                          </td>


                          {/* CREATOR */}

                          <td className="px-4 py-4">

                            <div className="flex min-w-0 items-center gap-3">

                              {creator.profile_pic ? (

                                <img
                                  src={creator.profile_pic}
                                  alt={
                                    creator.full_name ||
                                    "Creator"
                                  }
                                  className="h-9 w-9 shrink-0 rounded-full border border-gray-200 object-cover"
                                />

                              ) : (

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#EFF6FF] text-[11px] font-semibold text-[#2563EB]">
                                  {getAvatarText(
                                    creator,
                                    "Creator"
                                  )}
                                </div>

                              )}

                              <div className="min-w-0">

                                <p className="truncate text-[13px] font-semibold text-[#101828]">
                                  {creator.full_name ||
                                    `${creator.first_name || ""} ${creator.last_name || ""}`.trim() ||
                                    "Unknown"}
                                </p>

                                <p className="mt-0.5 truncate text-[11px] text-[#667085]">
                                  {creator.user_name
                                    ? `@${creator.user_name.replace(/^@/, "")}`
                                    : "N/A"}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* SOCIALS */}

                          <td className="pl-10 px-4 py-4">

                            <p className="text-[13px] font-semibold text-[#344054]">
                              {formatNumber(
                                creator.total_socials
                              )}
                            </p>

                          </td>


                          {/* COINS */}

                          <td className="px-4 py-4">

                            <p className="text-[13px] font-semibold text-[#344054]">
                              {formatNumber(
                                creator.available_coins
                              )}
                            </p>

                          </td>


                          {/* CREATED */}

                          <td className="px-4 py-4">

                            <DateTime
                              date={formatDate(
                                creator.createdAt
                              )}
                              time={formatTime(
                                creator.createdAt
                              )}
                            />

                          </td>


                          {/* STATUS */}

                          <td className="px-4 py-4">

                            <Tags
                              text={
                                isBlocked
                                  ? "Blocked"
                                  : isDeactivated
                                    ? "Deactivated"
                                    : "Active"
                              }
                              variant={
                                isBlocked
                                  ? "red"
                                  : isDeactivated
                                    ? "orange"
                                    : "green"
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
      </div>

    </div>
  );
};

export default DashboardPage;