import * as React from 'react';
import { cn } from '../core/utils/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxCharacters?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxCharacters, ...props }, ref) => {
    const [characterCount, setCharacterCount] = React.useState(0);

    React.useEffect(() => {
      // Ustaw początkową wartość licznika znaków na podstawie defaultValue lub value
      //@ts-ignore
      setCharacterCount(props.defaultValue?.length || props.value?.length || 0);
    }, [props.defaultValue, props.value]);

    const handleInputChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setCharacterCount(event.target.value.length);
      if (props.onChange) {
        props.onChange(event);
      }
    };

    return (
      <div className="relative">
        <textarea
          {...props}
          ref={ref}
          className={cn(
            'block w-full rounded-md rounded-br-none border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 scrollbar-thin h-32',
            className,
          )}
          onChange={handleInputChange}
          maxLength={maxCharacters}
        />
        {maxCharacters && (
          <div className="flex justify-end">
            <div className="text-sm text-muted-foreground p-1 inline-flex">
              {characterCount}/{maxCharacters}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
