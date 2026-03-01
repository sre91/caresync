import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2";

    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-600 text-gray-300 hover:bg-gray-800",
      ghost: "text-gray-300 hover:bg-gray-800",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
