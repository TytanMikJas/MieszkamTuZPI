import { Toaster } from 'sonner';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { memo, useEffect } from 'react';
import { Outlet } from 'react-router';

const GlobalLayout = function () {
  return (
    <>
      <Toaster position="top-right" />
      <TooltipProvider delayDuration={0}>
        <div className="w-full h-[100vh]">
          <div className="h-[93vh] w-full">
            <Outlet />
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default memo(GlobalLayout);
