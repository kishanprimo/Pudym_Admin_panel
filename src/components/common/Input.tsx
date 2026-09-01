import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
};

const Input = ({
  icon,
  rightIcon,
  error = false,
  className = "",
  ...props
}: Props) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}

      <input
        {...props}
        className={`w-full rounded-xl ${
          error
            ? "border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
            : "border border-gray-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
        } py-3.5 pl-11 pr-11 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${className}`}
      />

      {rightIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default Input;