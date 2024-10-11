import { Button, ButtonProps } from '@/shadcn/button';
import Loader from '../loaders/Loader';

interface ButtonWithLoaderProps extends ButtonProps {
  isLoading: boolean;
}

function ButtonWithLoader({
  isLoading,
  children,
  ...props
}: ButtonWithLoaderProps) {
  const isLoadingClasses = 'mb-0 bg-white pointer-events-none';

  return (
    <Button
      {...props}
      onClick={(e) => {
        setTimeout(() => {
          props.onClick && props.onClick(e);
        }, 200);
      }}
      className={`${props.className} ${isLoading && isLoadingClasses} ${props.className}`}
    >
      {!isLoading && children}
      {isLoading && (
        <div className="">
          <Loader height={5} width={2} />
        </div>
      )}
    </Button>
  );
}

export default ButtonWithLoader;
