interface TagsProps {
  text: string;
  color?: string; // Optional custom color class
  bgColor?: string; // Optional custom background color class
  className?: string; // Additional classes
  variant?: 'orange' | 'red' | 'blue' | 'emerald' | 'gray' | 'purple' | 'cyan' | 'green'; // Predefined variants
}

const variantStyles = {
  orange: 'bg-orange-50 text-orange-500',
  red: 'bg-red-50 text-red-500',
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  gray: 'bg-gray-100 text-gray-600',
  purple: 'bg-purple-50 text-purple-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  green: 'bg-green-50 text-green-600',
};

export default function Tags({
  text,
  color,
  bgColor,
  className = '',
  variant,
}: TagsProps) {
  const baseStyles = 'px-3 py-1 rounded-full text-[13px] font-medium inline-block whitespace-nowrap';
  
  let dynamicStyles = '';
  if (variant && variantStyles[variant]) {
    dynamicStyles = variantStyles[variant];
  } else if (color && bgColor) {
    dynamicStyles = `${bgColor} ${color}`;
  } else {
    dynamicStyles = variantStyles.gray; // Default
  }

  return (
    <span className={`${baseStyles} ${dynamicStyles} ${className}`}>
      {text}
    </span>
  );
}
