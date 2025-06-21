"use client";

import { User } from "firebase/auth";

interface UserIconProps {
  user: User;
}

export function UserIcon({ user }: UserIconProps) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={user.photoURL || "/placeholder-user.jpg"}
        alt={user.displayName || "User"}
        className="h-8 w-8 rounded-full object-cover"
      />
      <p className="text-sm font-medium text-gray-700">{user.displayName || "Unknown User"}</p>
    </div>
  );
}
