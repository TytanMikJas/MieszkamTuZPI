import { Checkbox } from '@/shadcn/checkbox';
import { useController } from 'react-hook-form';

interface ControlledCheckboxProps {
  control: any;
  name: string;
  rules?: any;
  defaultValue?: any;
}

export default function ControlledCheckbox({
  control,
  name,
  rules,
  defaultValue,
  ...checkboxProps
}: ControlledCheckboxProps) {
  const {
    field: { ref, value, onChange },
  } = useController({ name, control, rules, defaultValue });

  const handleValueChange = (value: any) => {
    onChange(value);
  };
  return (
    <Checkbox {...checkboxProps} checked={value} onCheckedChange={onChange} />
  );
}
