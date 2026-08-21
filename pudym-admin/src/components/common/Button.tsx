type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button = ({
  children,
  loading = false,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      style={{ cursor: loading ? "not-allowed" : "pointer" }}
      className={`w-full cursor-pointer bg-[#2563EB] hover:bg-[#1D4ED8] transition-all text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;