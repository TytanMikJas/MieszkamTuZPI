import { Toaster } from 'sonner';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { memo, useEffect } from 'react';
import { Outlet } from 'react-router';
import ImageGallery from '@/reusable-components/ImageGallery/ImageGallery';

const GlobalLayout = function () {
  return (
    <>
      <Toaster position="top-right" />
      <ImageGallery />
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
