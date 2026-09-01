"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Users,
    UserCheck,
    BadgeCheck,
    Plus,
    Minus,
    Percent,
    ArrowDownCircle,
    FileWarning,
    ShieldAlert,
    DollarSign,
    Bell,
    RotateCcw,
    TrendingUp,
    BadgeDollarSign,
    FileVideo,
} from "lucide-react";

type SubMenuItem = {
    name: string;
    href: string;
};

type MenuItem = {
    name: string;
    href?: string;
    icon: React.ElementType;
    children?: SubMenuItem[];
};

type MenuGroup = {
    heading: string;
    items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
    {
        heading: "DASHBOARD",
        items: [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },

    {
        heading: "USER MANAGEMENT",
        items: [
            {
                name: "All Users",
                href: "/AllUsers/userslist",
                icon: Users,
            },
        ],
    },
    {
        heading: "CONTENT MANAGEMENT",
        items: [
            {
                name: "Content Management",
                icon: FileVideo,
                children: [
                    {
                        name: "Posts",
                        href: "/ContentManagement/posts",
                    },
                    {
                        name: "Reels",
                        href: "/ContentManagement/reels",
                    },
                    {
                        name: "Tweets",
                        href: "/ContentManagement/tweets",
                    },
                    {
                        name: "Campaigns",
                        href: "/ContentManagement/campaigns",
                    },
                ],
            },
        ],
    },
    {
        heading: "CREATOR MANAGEMENT",
        items: [
            {
                name: "Creator Requests",
                href: "/creator-requests",
                icon: UserCheck,
            },
            {
                name: "Creators",
                href: "/creators",
                icon: BadgeCheck,
            },
        ],
    },
    {
        heading: "MODERATION REPORTS",
        items: [
            {
                name: "Content Reports",
                href: "/moderation/content-reports",
                icon: FileWarning,
            },
            {
                name: "User Reports",
                href: "/moderation/user-reports",
                icon: ShieldAlert,
            },
        ],
    },
    {
        heading: "ACCOUNT MANAGEMENT",
        items: [
            {
                name: "Reactivation Requests",
                href: "/AccountManagement/reactivation-requests",
                icon: RotateCcw,
            },
        ],
    },
    {
        heading: "FEES MANAGEMENT",
        items: [
            {
                name: "Fees",
                icon: DollarSign,
                children: [
                    { name: "Fees Type List", href: "/fees/fees-type-list" },
                    { name: "Add Fees Type", href: "/fees/add-fee-type" },
                ],
            },
            {
                name: "Creator Fees",
                icon: Percent,
                children: [
                    { name: "Creator Fees List", href: "/fees/creator-fees-list" },
                    { name: "Add Creator Fees", href: "/fees/add-creator-fee" },
                ],
            },
        ],
    },
    {
        heading: "WITHDRAWAL",
        items: [
            {
                name: "Withdrawals",
                href: "/withdrawal/list",
                icon: ArrowDownCircle,
            },
        ],
    },
    {
        heading: "CREATOR PLAN",
        items: [
            {
                name: "Creator's Plan",
                href: "/creator-plans/list",
                icon: BadgeDollarSign,
            },
        ],
    },
    {
        heading: "NOTIFICATIONS",
        items: [
            {
                name: "Notifications",
                icon: Bell,
                children: [
                    {
                        name: "Notification List",
                        href: "/notifications",
                    },
                    {
                        name: "Send Notification",
                        href: "/notifications/send",
                    },
                ],
            },
        ],
    },
    {
        heading: "REVENUE & GROWTH",
        items: [
            {
                name: "Revenue & Growth",
                icon: TrendingUp,
                children: [
                    {
                        name: "Transaction History",
                        href: "/revenue-growth/revenue",
                    },

                    {
                        name: "Creator Subscriptions",
                        href: "/revenue-growth/creator-subscriptions",
                    },
                ],
            },
        ],
    },
];

type SidebarProps = {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
}: SidebarProps) => {
    const pathname = usePathname();

    const [expandedMenu, setExpandedMenu] =
        useState<string | null>(null);

    useEffect(() => {
        menuGroups.forEach((group) => {
            group.items.forEach((item) => {
                if (
                    item.children?.some(
                        (child) => child.href === pathname
                    )
                ) {
                    setExpandedMenu(item.name);
                }
            });
        });
    }, [pathname]);

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`
          fixed
          top-0
          left-0
          z-40
          h-screen
          w-[280px]
          border-r
          border-gray-200
          bg-white
          transition-transform
          duration-300
          lg:translate-x-0
          ${sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
        `}
            >
                {/* Logo */}
                <div className="flex h-[70px] items-center border-b border-gray-100 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB]/10">
                            <span className="text-xl">💬</span>
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                Pudym
                            </h1>

                            <p className="text-[11px] text-gray-400">
                                Admin Panel
                            </p>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <div
                    className="
            h-[calc(100vh-70px)]
            overflow-y-auto
            py-6
            custom-scrollbar
          "
                >
                    <nav className="space-y-8">
                        {menuGroups.map((group) => (
                            <div key={group.heading}>
                                <p className="mb-3 px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A8A8A]">
                                    {group.heading}
                                </p>

                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;

                                        const hasChildren =
                                            Boolean(
                                                item.children &&
                                                item.children.length > 0
                                            );

                                        const isExpanded =
                                            expandedMenu === item.name;

                                        const isParentActive =
                                            hasChildren &&
                                            item.children?.some(
                                                (child) =>
                                                    child.href === pathname
                                            );

                                        /* Expandable Menu */
                                        if (hasChildren) {
                                            return (
                                                <div key={item.name}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setExpandedMenu(
                                                                (prev) =>
                                                                    prev === item.name
                                                                        ? null
                                                                        : item.name
                                                            )
                                                        }
                                                        className={`
                              relative flex w-full items-center
                              justify-between gap-3 px-6 py-3
                              text-sm font-medium transition-all
                              ${isParentActive
                                                                ? "bg-[#EEF4FF] text-[#2563EB]"
                                                                : "text-[#374151] hover:bg-gray-50"
                                                            }
                            `}
                                                    >
                                                        {isParentActive && (
                                                            <span className="absolute left-0 top-0 h-full w-1 rounded-r-xl bg-[#2563EB]" />
                                                        )}

                                                        <div className="flex items-center gap-3">
                                                            <Icon
                                                                size={20}
                                                                className={
                                                                    isParentActive
                                                                        ? "text-[#2563EB]"
                                                                        : "text-gray-500"
                                                                }
                                                            />

                                                            <span>{item.name}</span>
                                                        </div>

                                                        {isExpanded ? (
                                                            <Minus size={14} />
                                                        ) : (
                                                            <Plus size={14} />
                                                        )}
                                                    </button>

                                                    {/* Submenu */}
                                                    <div
                                                        className={`
                              grid transition-all duration-300
                              ${isExpanded
                                                                ? "grid-rows-[1fr] opacity-100"
                                                                : "grid-rows-[0fr] opacity-0"
                                                            }
                            `}
                                                    >
                                                        <div className="overflow-hidden">
                                                            <div className="relative ml-[33px] mt-1 border-l-2 border-gray-100 pb-2 pl-1.5">
                                                                {item.children?.map(
                                                                    (child) => {
                                                                        const childActive =
                                                                            pathname ===
                                                                            child.href;

                                                                        return (
                                                                            <Link
                                                                                key={child.name}
                                                                                href={child.href}
                                                                                onClick={() => {
                                                                                    if (
                                                                                        window.innerWidth <
                                                                                        1024
                                                                                    ) {
                                                                                        setSidebarOpen(
                                                                                            false
                                                                                        );
                                                                                    }
                                                                                }}
                                                                                className={`
                                          relative flex w-full
                                          items-center px-4 py-2
                                          text-sm transition-all
                                          ${childActive
                                                                                        ? "font-medium text-[#2563EB]"
                                                                                        : "text-gray-500 hover:text-gray-800"
                                                                                    }
                                        `}
                                                                            >
                                                                                {childActive && (
                                                                                    <span className="absolute -left-[11px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#2563EB] shadow-sm" />
                                                                                )}

                                                                                {child.name}
                                                                            </Link>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        /* Normal Menu Item */
                                        const active =
                                            pathname === item.href;

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href || "#"}
                                                onClick={() => {
                                                    if (
                                                        window.innerWidth < 1024
                                                    ) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                                className={`
                          relative flex items-center gap-3
                          px-6 py-3 text-sm font-medium
                          transition-all
                          ${active
                                                        ? "bg-[#EEF4FF] text-[#2563EB]"
                                                        : "text-[#374151] hover:bg-gray-50"
                                                    }
                        `}
                                            >
                                                {active && (
                                                    <span className="absolute left-0 top-0 h-full w-1 rounded-r-xl bg-[#2563EB]" />
                                                )}

                                                <Icon
                                                    size={20}
                                                    className={
                                                        active
                                                            ? "text-[#2563EB]"
                                                            : "text-gray-500"
                                                    }
                                                />

                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Scrollbar */}
                <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 999px;
          }

          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #d1d5db transparent;
          }
        `}</style>
            </aside>
        </>
    );
};

export default Sidebar;