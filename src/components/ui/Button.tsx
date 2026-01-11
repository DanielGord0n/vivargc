import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                    // Variants
                    variant === "primary" && "bg-brand text-white hover:bg-brand-dark focus:ring-brand shadow-md hover:shadow-lg",
                    variant === "secondary" && "bg-blush/30 text-brand-dark hover:bg-blush/50 focus:ring-blush",
                    variant === "outline" && "border border-brand text-brand hover:bg-brand/5 focus:ring-brand",
                    variant === "ghost" && "text-gray-700 hover:bg-gray-100 hover:text-brand",

                    // Sizes
                    size === "sm" && "text-xs px-4 py-2",
                    size === "md" && "text-sm px-6 py-3",
                    size === "lg" && "text-base px-8 py-4",

                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
