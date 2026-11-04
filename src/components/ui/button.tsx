import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 min-h-11 px-4",
  {
    variants: {
      variant: {
        /* Navy blue fill, white label. The default for a screen's main action. */
        primary: "bg-navy text-primary-fg hover:bg-navy-dark",
        /* Deep navy fill for dense toolbars; white label. */
        ink: "bg-ink text-paper hover:bg-ink/90",
        /* No fill, navy label — quiet actions on white. */
        ghost: "bg-transparent text-ink hover:bg-sky-soft",
        /* White button with a hairline edge — safe on any white surface. */
        outline: "bg-paper text-ink shadow-border hover:shadow-border-hover",
        /* Sky blue fill, dark blue label — the accent that still reads on a navy panel. */
        sky: "bg-sky text-accent-ink hover:bg-sky-dark hover:text-paper",
        danger: "bg-rose-soft text-rose hover:bg-rose-soft/80",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>
>(({ className, variant, type = "button", ...props }, ref) => (
  <button ref={ref} type={type} className={cn(buttonVariants({ variant }), className)} {...props} />
));
Button.displayName = "Button";
