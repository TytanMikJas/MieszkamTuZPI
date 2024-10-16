// TruncateAuto.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from 'src/shadcn/tooltip';

interface TruncateAutoProps {
  text: string;
  tooltip?: boolean;
  maxLines?: number;
  classNames?: string;
}

const TruncateAuto: React.FC<TruncateAutoProps> = ({
  text,
  tooltip = false,
  maxLines = 1,
  classNames = '',
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Update the state if the text is truncated
    if (textRef.current) {
      setIsTruncated(textRef.current.offsetWidth < textRef.current.scrollWidth);
    }
  }, [text]);

  const combinedClassNames = `line-clamp-${maxLines} ${classNames}`;

  // TODO: Tooltip not yet working but no idea how to make it work
  return (
    <TooltipProvider>
      <div className={combinedClassNames}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span ref={textRef}>{text}</span>
          </TooltipTrigger>

          <TooltipContent side="top" className="z-999">
            <p>{text}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default TruncateAuto;
