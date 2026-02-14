"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Avatar.displayName = "Avatar";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, alt, ...props }, ref) => {
    return (
      <img
        ref={ref}
        alt={alt}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  delayMs?: number;
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-brand to-[#4fa85c] text-bg font-semibold text-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visibleChildren = max ? childArray.slice(0, max) : childArray;

    return (
      <div
        ref={ref}
        className={cn("flex -space-x-3", className)}
        {...props}
      >
        {visibleChildren}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

interface AvatarGroupCountProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const AvatarGroupCount = React.forwardRef<HTMLDivElement, AvatarGroupCountProps>(
  ({ className, children, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full",
          "bg-white/8 border-2 border-bg text-primary font-medium",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AvatarGroupCount.displayName = "AvatarGroupCount";

// Generate a random color based on string
function stringToColor(str: string): string {
  const colors = [
    "from-emerald-400 to-emerald-600",
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-yellow-400 to-yellow-600",
    "from-orange-400 to-orange-600",
    "from-cyan-400 to-cyan-600",
    "from-rose-400 to-rose-600",
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

// Generate initials from a name or ID
function getInitials(name: string): string {
  if (!name) return "?";
  
  // If it's a number or short string, just return first char
  if (name.length <= 2) return name.toUpperCase();
  
  // Try to get first letter of first two words
  const parts = name.split(/[\s_-]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return name.slice(0, 2).toUpperCase();
}

interface UserAvatarProps {
  userId: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const UserAvatar = ({ userId, name, size = "md", className }: UserAvatarProps) => {
  const initials = getInitials(name || userId.slice(-4));
  const colorClass = stringToColor(userId);

  return (
    <Avatar size={size} className={cn("border-2 border-bg", className)}>
      <AvatarFallback className={cn("bg-linear-to-br", colorClass)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

interface RoomUsersDisplayProps {
  userCount: number;
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const RoomUsersDisplay = ({ 
  userCount, 
  maxDisplay = 3, 
  size = "md",
  className 
}: RoomUsersDisplayProps) => {
  // Generate placeholder users based on count
  const displayCount = Math.min(userCount, maxDisplay);
  const remainingCount = userCount - displayCount;
  
  // Generate random but consistent user IDs for display
  const displayUsers = Array.from({ length: displayCount }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`
  }));

  return (
    <div className={cn("flex items-center gap-1.5 sm:gap-2", className)}>
      <AvatarGroup>
        {displayUsers.map((user) => (
          <UserAvatar 
            key={user.id} 
            userId={user.id} 
            name={user.name}
            size={size}
          />
        ))}
        {remainingCount > 0 && (
          <AvatarGroupCount size={size}>
            +{remainingCount}
          </AvatarGroupCount>
        )}
      </AvatarGroup>
      <span className="text-xs sm:text-sm text-primary/50 ml-0.5 sm:ml-1 hidden sm:inline">
        {userCount} {userCount === 1 ? "user" : "users"}
      </span>
      <span className="text-xs text-primary/50 ml-0.5 sm:hidden">
        {userCount}
      </span>
    </div>
  );
};

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  UserAvatar,
  RoomUsersDisplay,
};
