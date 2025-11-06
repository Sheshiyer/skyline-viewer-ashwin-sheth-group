"use client";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <img
      src="/AshwinShethFinalLogo.svg"
      alt="Ashwin Sheth Group"
      width={160}
      height={44}
      loading="lazy"
      decoding="async"
      style={{ height: "auto" }}
      className={className ?? "object-contain"}
    />
  );
}