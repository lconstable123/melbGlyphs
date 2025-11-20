import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "transition-all suse-mono inline-flex cursor-pointer hover:bg-primary/90  items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          " border text-gray-200 hover:text-white  bg-black border-white/60 transition-all duration-300 outline  hover:outline-fuchsia-500 outline-fuchsia-500/60   focus-visible:outline-none focus-visible:ring-1 ",
        onImage:
          "bg-black text-black  p-3  text-primary-foreground inline-flex cursor-pointer border-fuchsia-500/100 hover:border-fuchsia-500/100  ",
        destructive:
          "bg-fuchsia-950 transition-all duration-300 outline hover:outline-fuchsia-500 outline-fuchsia-500/60 focus-visible:outline-none focus-visible:ring-1 ",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-6 px-4 py-1  has-[>svg]:px-3",
        sm: "h-6 rounded-md gap-1.5     px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      accessability: {
        true: "",
        false:
          "focus:bg-red-200 focus-visible:ring-0! focus-visible:ring-offset-0! outline-none! ",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      accessability: true,
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
