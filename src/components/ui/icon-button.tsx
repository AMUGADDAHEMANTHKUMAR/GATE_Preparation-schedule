import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonProps } from './button';

interface IconButtonProps extends Omit<ButtonProps, 'children' | 'size'> {
  icon: React.ComponentType<{ className?: string }>;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  label,
  size = 'md',
  variant = 'ghost',
  className,
  ...props
}) => {
  // Map our sizes to Button component sizes
  const buttonSize = size === 'md' ? 'default' : size;
  
  const sizeClasses = {
    sm: 'h-8 w-8 p-1',
    md: 'h-10 w-10 p-2',
    lg: 'h-12 w-12 p-3'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <Button
      variant={variant}
      size={buttonSize}
      className={cn(sizeClasses[size], className)}
      {...props}
    >
      <Icon className={iconSizes[size]} />
      {label && <span className="sr-only">{label}</span>}
    </Button>
  );
};
