import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 60,
  xl: 80,
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const logoSize = sizeMap[size];
  const textSize = sizeMap[size] * 3.5;

  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/job-hunting-logo-small.png"
        alt="就活サポーター"
        width={logoSize}
        height={logoSize}
        className="rounded-full shadow-sm"
        priority
      />
      {showText && (
        <span
          className={cn(
            "font-semibold text-gray-800",
            size === "sm" && "text-sm",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl",
            size === "xl" && "text-3xl"
          )}
        >
          <Image
            src="/job-hunting-text.png"
            alt="就活サポーターテキスト"
            width={textSize}
            height={0}
            className="shadow-sm h-auto"
            priority
          />
        </span>
      )}
    </div>
  );
}
