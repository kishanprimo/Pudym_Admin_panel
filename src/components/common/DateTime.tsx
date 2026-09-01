interface DateTimeProps {
  date: string;
  time?: string;
  dateClassName?: string;
  timeClassName?: string;
  className?: string;
}

export default function DateTime({
  date,
  time,
  dateClassName = "text-[14px] text-gray-700 font-medium",
  timeClassName = "text-[12px] text-gray-600 mt-1",
  className = "",
}: DateTimeProps) {
  return (
    <div className={className}>
      <p className={dateClassName}>{date}</p>
      {time && <p className={timeClassName}>{time}</p>}
    </div>
  );
}
