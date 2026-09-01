import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const Card = ({ children, className = "" }: Props) => {
  return (
    <div
      className={`rounded-2xl bg-white border border-gray-100 shadow-[0_20px_60px_rgba(15,23,42,0.12)] ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;