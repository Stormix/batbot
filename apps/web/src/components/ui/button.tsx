import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils/styles';
import { LoaderCircle } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        khnouni: 'bg-khnouni text-black hover:bg-khnouni/90',
        destructive: 'bg-red-400 text-black hover:bg-red-400/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        accent: 'bg-accent text-accent-foreground shadow-sm hover:bg-accent/90',
        discord: 'bg-discord text-white shadow-sm hover:bg-discord/90'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, icon, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const fallback = loading || icon;

    if (fallback) {
      return (
        <button className={cn(buttonVariants({ variant, size, className }), 'gap-2')} ref={ref} {...props}>
          {!loading && icon}
          {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
          {children ?? null}
        </button>
      );
    }
    return (
      // eslint-disable-next-line react/no-children-prop
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} children={children} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
