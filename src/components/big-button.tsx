import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  block?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-foreground hover:opacity-90 active:scale-[0.98] shadow-sm",
  secondary: "bg-muted text-foreground hover:bg-muted/80 active:scale-[0.98]",
  ghost: "bg-transparent text-foreground hover:bg-muted",
};

export const BigButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", icon, block = true, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 h-14 px-6 rounded-2xl text-base font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none",
        block && "w-full",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  ),
);
BigButton.displayName = "BigButton";
