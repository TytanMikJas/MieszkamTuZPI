import { ReactElement } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/shadcn/popover';
import { MaterialSymbol } from 'react-material-symbols';

interface HelpPopoverProps {
  icon?: ReactElement;
  content?: string;
  htmlContent?: ReactElement;
}

const HelpPopover: React.FC<HelpPopoverProps> = ({
  icon = (
    <MaterialSymbol size={36} icon="help" color="#2b6cb0" className="ml-2" />
  ),
  content,
  htmlContent,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{icon}</PopoverTrigger>
      <PopoverContent className="w-screen md:w-96 p-4 shadow-lg rounded-lg z-[9999999999999]">
        {content ? <p className="text-sm">{content}</p> : ''}
        {htmlContent ? htmlContent : null}
      </PopoverContent>
    </Popover>
  );
};

export default HelpPopover;
