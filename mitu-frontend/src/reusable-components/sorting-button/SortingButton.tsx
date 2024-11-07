import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../shadcn/dropdown-menu';
import { ReactElement, useState } from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import IconButton from '../IconButton';

function DropDownMenuItems({ options }: { options: string[][] }) {
  return options.map((option, i) => {
    return (
      <div key={i}>
        <DropdownMenuSeparator key={i} style={{ height: '0.1rem' }} />
        {option.map((option, i) => {
          return (
            <DropdownMenuRadioItem key={i} value={option}>
              {option}
            </DropdownMenuRadioItem>
          );
        })}
      </div>
    );
  });
}

export default function SortingButton({
  icon = (
    <MaterialSymbol
      icon="sort"
      size={30}
      fill
      grade={25}
      color="blue"
    ></MaterialSymbol>
  ),
  textStatic = 'Sortuj',
  options,
  defaultOption = 'Najnowsze',
  callback,
  menuAlignment = 'start',
  currentOption,
  setCurrentOption,
}: {
  icon?: ReactElement;
  textStatic?: string;
  options: string[][];
  currentOption: string;
  setCurrentOption: (option: string) => void;
  defaultOption: string;
  callback: (option: string) => void;
  menuAlignment?: 'start' | 'center' | 'end';
}) {
  const dynamicTest = (
    <>
      <span className="ml-2 font-bold">{currentOption}</span>
    </>
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          icon={icon}
          text={textStatic}
          buttonType={{ variant: 'outline', size: 'lg' }}
          kids={dynamicTest}
          className="min-w-32 shadow-sm"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 z-[4000000000]"
        align={menuAlignment}
      >
        <DropdownMenuRadioGroup
          value={currentOption}
          onValueChange={(selectedOption) => {
            setCurrentOption(selectedOption);
            callback(selectedOption);
          }}
        >
          <DropDownMenuItems options={options} />
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
