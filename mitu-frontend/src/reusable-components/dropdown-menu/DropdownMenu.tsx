import { Button } from '../../shadcn/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../../shadcn/dropdown-menu';

interface ItemsProps {
  name: string;
  path: string;
  icon?: string;
  children?: ItemsProps[];
  primary?: boolean;
}

interface DropdownMenuProps {
  items: ItemsProps[];
}

export default function CustomDropdownMenu({ items }: DropdownMenuProps) {
  return (
    <header>
      {items.map((item, index) => {
        return item.children ? (
          <DropdownMenu key={item.name + index}>
            <DropdownMenuTrigger asChild>
              <Button variant="link">{item.name}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[4000000000]">
              {item.children.map((child, index) => (
                <Button variant="link" key={child.name + index}>
                  {child.name}
                </Button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <a href={item.path} key={item.name + index}>
            <Button variant="link">{item.name}</Button>
          </a>
        );
      })}
    </header>
  );
}
