"use client";

import { useEffect, useState } from "react";

interface TogglableSwitchProps {
    isActive: boolean;
    onToggle: () => void;

    activeLabel?: string;
    inactiveLabel?: string;

    activeClassName?: string;
    inactiveClassName?: string;

    showLabel?: boolean;

    disabled?: boolean;
    disabledLabel?: string;
    disabledClassName?: string;

    // API/loading state.
    // Unlike disabled, this does not change
    // the status label.
    loading?: boolean;
}

export default function TogglableSwitch({
    isActive,
    onToggle,

    activeLabel = "Active",
    inactiveLabel = "Deactivated",

    activeClassName = "bg-emerald-50 text-emerald-600",
    inactiveClassName = "bg-orange-50 text-orange-600",

    showLabel = true,

    disabled = false,
    disabledLabel = "Disabled",
    disabledClassName = "bg-red-50 text-red-600",

    loading = false,
}: TogglableSwitchProps) {

    /*
     * Local visual state.
     *
     * This allows the switch and label
     * to change together immediately.
     */
    const [visualActive, setVisualActive] =
        useState(isActive);

    /*
     * Keep local state synchronized
     * with the actual Redux/API state.
     */
    useEffect(() => {
        setVisualActive(isActive);
    }, [isActive]);

    const handleToggle = () => {
        if (disabled || loading) return;

        setVisualActive((current) => !current);

        onToggle();
    };

    const currentActive =
        disabled ? false : visualActive;

    return (
        <div className="flex items-center gap-2.5">

            {/* STATUS LABEL */}

            {showLabel && (
                <span
                    className={`
                        inline-flex
                        min-w-[88px]
                        h-[28px]
                        items-center
                        justify-center
                        rounded-full
                        px-3
                        text-[12px]
                        font-semibold
                        whitespace-nowrap
                        transition-all
                        duration-200
                        ease-in-out
                        ${disabled
                            ? disabledClassName
                            : currentActive
                                ? activeClassName
                                : inactiveClassName
                        }
                    `}
                >
                    {disabled
                        ? disabledLabel
                        : currentActive
                            ? activeLabel
                            : inactiveLabel}
                </span>
            )}

            {/* SWITCH */}

            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled || loading}
                aria-label={
                    disabled
                        ? disabledLabel
                        : currentActive
                            ? activeLabel
                            : inactiveLabel
                }
                className={`
                            relative
                            flex
                            h-6
                            w-11
                            shrink-0
                            items-center
                            rounded-full
                            transition-colors
                            duration-300
                            ease-in-out
                            focus:outline-none
                            ${disabled
                                            ? "cursor-not-allowed bg-red-500"
                                            : currentActive
                                                ? "cursor-pointer bg-emerald-500 hover:bg-emerald-600"
                                                : "cursor-pointer bg-gray-300 hover:bg-gray-400"
                                        }
                            ${loading ? "cursor-wait opacity-70" : ""}
                        `}
            >

                <span
                    className={`
                        absolute
                        left-0.5
                        h-5
                        w-5
                        rounded-full
                        bg-white
                        shadow-[0_1px_3px_rgba(0,0,0,0.25)]
                        transition-transform
                        duration-300
                        ease-in-out
                        ${currentActive
                            ? "translate-x-5"
                            : "translate-x-0"
                        }
                    `}
                />

            </button>

        </div>
    );
}