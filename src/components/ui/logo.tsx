import { cn } from "../../utils/cn";
import logoDefault from "../../assets/quick-rest-logos/quickrest-logo.svg";

export type LogoVariant = "default";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const logoPaths: Record<LogoVariant, string> = {
  default: logoDefault,
};

export const Logo = ({
  variant = "default",
  className,
  width,
  height,
}: LogoProps) => {
  const logoPath = logoPaths[variant];

  return (
    <img
      src={logoPath}
      alt="QuickRest"
      className={cn("object-contain", className)}
      width={width}
      height={height}
    />
  );
};
