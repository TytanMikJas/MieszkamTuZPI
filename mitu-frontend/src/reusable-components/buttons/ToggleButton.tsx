import IconButton from '../IconButton';
import { ReactElement } from 'react';

export default function ToggleButton({
  onClick,
  isActive,
  children,
  icon,
  className,
}: {
  onClick: () => void;
  isActive: boolean;
  children: ReactElement;
  icon?: ReactElement;
  className?: string;
}) {
  return (
    <IconButton
      onClick={onClick}
      icon={icon}
      className={className}
      buttonType={
        isActive
          ? { variant: 'secondary', size: 'default' }
          : { variant: 'default', size: 'default' }
      }
      children={children}
    ></IconButton>
  );
}
