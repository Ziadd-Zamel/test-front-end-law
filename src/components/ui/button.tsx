import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { HiArrowLongRight } from "react-icons/hi2";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none cursor-pointer [&_svg]:shrink-0 hover:transition-all hover:duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-300",
        outline:
          "border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-blue-100 disabled:border-blue-300 disabled:text-blue-300",
        destructive:
          "bg-red-600 text-white hover:bg-red-500 disabled:bg-red-300 disabled:border-red-300",
        secondary:
          "bg-gray-100 text-blue-700 hover:bg-gray-200 border border-gray-300 disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400",
        ghost:
          "text-blue-600 hover:bg-blue-50 hover:text-blue-700 disabled:text-blue-300",
        soft: "bg-blue-50 text-blue-700 hover:bg-blue-100",

        link: "bg-transparent text-blue-600 underline underline-offset-4 hover:no-underline hover:text-blue-700 focus-visible:ring-0",
        elevated:
          "bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-500",
        inverted:
          "bg-white text-blue-700 hover:bg-blue-50 border border-blue-200",
        trigger:
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground [&>span]:line-clamp-1",
      },

      size: {
        xs: "px-2.5 py-1.5 text-xs",
        default: "px-4 py-2.5",
        sm: "rounded-md px-3 py-2 text-sm",
        lg: "rounded-lg px-8 py-4 text-base",
        xl: "rounded-xl px-10 py-5 text-base",
        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  routable?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      routable = false,
      children = "Button",
      asChild = false,
      ...props
    },
    ref
  ) => {
    void loading;
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {loading && <Loader2 size={18} className="animate-spin" />}
        {routable && <HiArrowLongRight size={25} className="rtl:rotate-180" />}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
