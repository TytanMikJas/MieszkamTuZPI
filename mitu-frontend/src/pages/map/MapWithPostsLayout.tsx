import { Outlet } from 'react-router';
import Stager from '@/reusable-components/right-panel/Stager';

function MapWithPostsLayout() {
  return (
    <>
      <div className="flex flex-column w-full h-full">
        <div className="flex-grow-0">
          <Outlet />
        </div>
        <div className="flex-1">
          <Stager />
        </div>
      </div>
    </>
  );
}

export default MapWithPostsLayout;
