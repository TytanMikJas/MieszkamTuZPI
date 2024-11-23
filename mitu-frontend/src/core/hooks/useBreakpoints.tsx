import React, { useEffect } from 'react';

export enum AppBreakpoint {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
}

function calculateBreakpoint() {
  const width = window.innerWidth;
  const isMobile = width < 768;
  if (isMobile) {
    return AppBreakpoint.MOBILE;
  }
  return AppBreakpoint.DESKTOP;
}

function useBreakpoints() {
  const [breakpoint, setBreakpoint] = React.useState<AppBreakpoint>(
    calculateBreakpoint(),
  );

  useEffect(() => {
    const handleResize = () => {
      const breakpoint = calculateBreakpoint();
      setBreakpoint(breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return breakpoint;
}

export default useBreakpoints;
