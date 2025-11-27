import { cn } from "../../utils/cn";

export type LogoVariant = "default";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const Logo = ({
  className,
  width = "100%",
  height = "100%",
}: LogoProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "object-contain text-zinc-900 dark:text-zinc-100",
        className
      )}
    >
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M110 50 L85 100 L100 100 L90 150 L115 100 L100 100 Z"
        fill="currentColor"
      />
      <circle cx="60" cy="70" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="140" cy="70" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="130" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="140" cy="130" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
};
