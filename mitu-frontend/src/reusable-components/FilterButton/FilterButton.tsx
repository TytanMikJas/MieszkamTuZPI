import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../shadcn/dropdown-menu';
import { ReactElement, useState } from 'react';
import IconButton from '../IconButton';
import { MaterialSymbol } from 'react-material-symbols';

type Checked = DropdownMenuCheckboxItemProps['checked'];

type FiltersType = {
  [key: string]: string[];
};

function DropDownMenu({
  filters,
  states,
  setSomethingChanged,
}: {
  filters: FiltersType;
  states: [Checked[], (checked: number) => void];
  setSomethingChanged: (changed: boolean) => void;
}) {
  let globalIndex = 0;

  return Object.keys(filters).map((categoryName, categoryIndex) => {
    return (
      <div key={categoryIndex}>
        <DropdownMenuLabel>{categoryName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filters[categoryName].map((filter) => {
          const index = globalIndex++;
          return (
            <DropdownMenuCheckboxItem
              key={filter}
              checked={states[0][index]}
              onCheckedChange={() => {
                setSomethingChanged(true);
                states[1](index);
              }}
            >
              {filter}
            </DropdownMenuCheckboxItem>
          );
        })}
      </div>
    );
  });
}

function useStates(
  statesNumber: number,
): [Checked[], (checked: number) => void] {
  const initStates: Checked[] = Array(statesNumber).fill(false);
  const [states, setStates] = useState(initStates);

  const setStateWrapper = (checked: number) => {
    setStates(states.map((state, i) => (i === checked ? !state : state)));
  };
  return [states, setStateWrapper];
}

export default function FilterButton({
  title,
  icon = (
    <MaterialSymbol
      icon="filter_list"
      size={30}
      fill
      grade={25}
      color="blue"
    ></MaterialSymbol>
  ),
  buttonType = {
    variant: 'outline',
    size: 'default',
  },
  menuAlignment = 'center',
  filters,
  callback,
}: {
  title: string;
  icon?: ReactElement;
  buttonType?: {
    variant:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link';
    size: 'default' | 'sm' | 'lg' | 'icon';
  };
  menuAlignment?: 'start' | 'center' | 'end';
  filters: FiltersType;
  callback: (appliedFilters: string[]) => void;
}) {
  const filterValues = Object.values(filters).flatMap(
    (filterValues) => filterValues,
  );
  const states = useStates(filterValues.length);
  const [isHovering, setIsHovering] = useState(false);
  const [somethingChanged, setSomethingChanged] = useState(true);
  return (
    <DropdownMenu
      onOpenChange={() => {
        if (somethingChanged) setIsHovering(true);
        else setIsHovering(false);
        setSomethingChanged(!somethingChanged);
      }}
      open={isHovering}
    >
      <DropdownMenuTrigger asChild>
        <IconButton
          text={title}
          icon={icon}
          buttonType={{ variant: 'outline', size: 'lg' }}
          className="shadow-sm"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 z-[4000000000]"
        align={menuAlignment}
        onMouseLeave={() => {
          setIsHovering(false);
          setSomethingChanged(true);
          callback(filterValues.filter((_, i) => states[0][i]));
        }}
      >
        <DropDownMenu
          filters={filters}
          states={states}
          setSomethingChanged={setSomethingChanged}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
