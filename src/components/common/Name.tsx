import React from 'react';

interface NameProps {
  profilePic?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  description?: string;
}

export default function Name({ profilePic, firstName, lastName, email, description }: NameProps) {
  const showAvatar =
    profilePic !== undefined &&
    profilePic !== null &&
    profilePic.trim() !== "";

  const initials = `${firstName || ""} ${lastName || ""}`
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div className="flex items-start gap-3">
      {showAvatar ? (
        <img
          src={profilePic}
          className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm shrink-0"
          alt="avatar"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold text-sm border border-[#2563EB] shrink-0">
          {initials || "U"}
        </div>
      )}
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <p className="text-[15px] font-semibold text-[#101828] leading-tight truncate">
          {`${firstName || ''} ${lastName || ''}`.trim() || 'Unknown'}
        </p>
        {email && (
          <p className="text-[13px] text-[#667085] mt-1 break-words">
            {email}
          </p>
        )}
        {description && (
          <p
            className="text-[13px] text-gray-500 mt-1 overflow-hidden text-ellipsis break-words"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
            title={description}
          >
            {description.replace(/<[^>]*>/g, "")}
          </p>
        )}
      </div>
    </div>
  );
}