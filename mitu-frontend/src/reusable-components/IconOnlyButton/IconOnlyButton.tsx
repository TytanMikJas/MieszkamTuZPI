import { Button } from '../../shadcn/button';
import { forwardRef, ReactElement } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../shadcn/tooltip';

interface IconButtonProps {
  icon?: ReactElement;
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

export const IconOnlyButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon, onClick, hint, buttonType, children, type, className, ...props },
    ref,
  ) => {
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
              <div className="flex items-center gap-1">{icon}</div>
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
IconOnlyButton.displayName = 'IconOnlyButton';

export default IconOnlyButton;
