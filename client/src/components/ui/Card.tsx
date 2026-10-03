import React from 'react';
import { cn } from '../../lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'interactive' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  default:
    'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm',
  elevated:
    'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-900/5 dark:shadow-black/20',
  outline:
    'bg-transparent border border-slate-200 dark:border-slate-800',
  interactive:
    'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer lift',
  subtle:
    'bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80',
};

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl text-slate-900 dark:text-slate-100 transition-colors',
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'font-display font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-slate-100',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-slate-600 dark:text-slate-400', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center pt-4 border-t border-slate-100 dark:border-slate-800/80',
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export default Card;
