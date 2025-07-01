"use client";

import type { User } from "firebase/auth";
import type { UserProfile } from "@/components/user/api";

interface UserIconProps {
  user: User;
  userProfile?: UserProfile | null;
}

export function UserIcon({ user, userProfile }: UserIconProps) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={userProfile?.icon || user.photoURL || "/placeholder-user.jpg"}
        alt={userProfile?.name || user.displayName || "User"}
        className="h-8 w-8 rounded-full object-cover"
      />
      <p className="text-sm font-medium text-gray-700">
        {userProfile?.name || user.displayName || "Unknown User"}
      </p>
    </div>
  );
}
