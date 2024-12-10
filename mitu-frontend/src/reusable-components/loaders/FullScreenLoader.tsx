import Loader from './Loader';

export function FullScreenLoader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-70 z-[10000]">
      <Loader />
    </div>
  );
}
