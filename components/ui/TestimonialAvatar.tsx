"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

// Falls back to the person's initials on a dark disc when the photo is
// missing or fails to load.
export function TestimonialAvatar({
  src,
  name,
  size = 40,
  className,
}: {
  src: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 ring-1 ring-white/10",
        className,
      )}
    >
      {initials}
      {!failed && (
        <Image
          src={src}
          alt=""
          width={size}
          height={size}
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </span>
  );
}
