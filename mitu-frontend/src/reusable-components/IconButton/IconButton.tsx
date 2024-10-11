import { cloneElement, forwardRef, ReactElement } from 'react';
import { Button } from '../../shadcn/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../shadcn/tooltip';

interface IconButtonProps {
  icon?: ReactElement;
  text?: string;
  onClick?: () => void;
  hint?: string;
  buttonType?: {
    variant:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link';
    size: 'default' | 'sm' | 'lg' | 'icon';
  };
  type?: 'button' | 'submit' | 'reset';
  children?: ReactElement;

  className?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      text,
      onClick,
      hint,
      buttonType,
      children,
      type,
      className,
      ...props
    },
    ref,
  ) => {
    // Ensure the icon is present and clone it with new props
    const iconWithClass = icon ? cloneElement(icon, { className: '' }) : null;
    const textClassName = text && icon ? 'ml-2' : ' ml-0';
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              className={className}
              onClick={onClick}
              variant={buttonType?.variant}
              size={buttonType?.size}
              type={type}
              {...props}
            >
              <div className="flex items-center gap-1">
                {iconWithClass}
                <p className={textClassName}>{text}</p>
                {children}
              </div>
            </Button>
          </TooltipTrigger>

          {hint && (
            <TooltipContent>
              <p>{hint}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  },
);
IconButton.displayName = 'IconButton';

export default IconButton;
