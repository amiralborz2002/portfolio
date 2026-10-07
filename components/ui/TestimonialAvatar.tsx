"use client";

import Image from "next/image";
import { useState } from "react";

// Falls back to the person's initials on a dark disc when the photo is
// missing or fails to load.
export function TestimonialAvatar({ src, name }: { src: string; name: string }) {
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
      className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 ring-1 ring-white/10"
    >
      {initials}
      {!failed && (
        <Image
          src={src}
          alt=""
          width={40}
          height={40}
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </span>
  );
}
