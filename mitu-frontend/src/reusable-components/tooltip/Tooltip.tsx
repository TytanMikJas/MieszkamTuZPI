import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip as TT,
} from 'src/shadcn/tooltip';

export default function Tooltip({
  children,
  text,
  visible = false,
}: {
  children: React.ReactNode;
  text: string;
  visible?: boolean;
}) {
  return (
    <TooltipProvider>
      <TT>
        <TooltipTrigger>{children}</TooltipTrigger>
        {visible && <TooltipContent>{text}</TooltipContent>}
      </TT>
    </TooltipProvider>
  );
}
