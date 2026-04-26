import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-canvas transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
        secondary: 'bg-surface-2 text-text border border-border hover:border-border-strong',
        ghost: 'text-text hover:bg-surface-2',
        outline: 'border border-border bg-surface text-text hover:border-border-strong hover:bg-surface-2',
        danger: 'bg-danger text-white hover:opacity-90',
        // Filled-soft — semi-transparent primary; reads as "in family" without the weight of a primary CTA.
        // Theme token: --color-primary-soft.
        soft: 'bg-primary-soft text-primary hover:bg-primary-soft-strong',
        // 3-stop brand gradient with AI-glow shadow on hover. Token-driven via --color-grad-from / via / to.
        gradient: 'bg-brand-gradient text-white hover:shadow-ai-glow hover:-translate-y-px transition-all',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-10 px-6',
        icon: 'h-9 w-9',
        iconSm: 'h-7 w-7',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
