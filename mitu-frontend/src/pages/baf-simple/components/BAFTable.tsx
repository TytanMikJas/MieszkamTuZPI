// BAFTable.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/shadcn/table';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from '@/shadcn/select';
import { Button } from '@/shadcn/button';
import { Input } from '@/shadcn/input';
import { MaterialSymbol } from 'react-material-symbols';
import IconOnlyButton from '@/reusable-components/IconOnlyButton';
import { ScrollArea, ScrollBar } from '@/shadcn/scroll-area';
import HelpPopover from '@/reusable-components/HelpPopover';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/shadcn/accordion';
import { SURFACES, FORM_ZAGOSPODAROWANIA_OPTIONS } from '@/constants';

type FormZagospodarowaniaOptions = {
  [key: string]: number;
};

const formZagospodarowaniaOptions: FormZagospodarowaniaOptions =
  FORM_ZAGOSPODAROWANIA_OPTIONS;

const surfaces = SURFACES;

const bafTableRowSchema = z.object({
  name: z.string(),
  areaType: z.string(),
  areaSize: z.coerce.number().positive(),
});

const bafTableSchema = z.object({
  rows: z.array(bafTableRowSchema),
});

type BafTableRow = z.infer<typeof bafTableRowSchema>;

type BafTableValues = z.infer<typeof bafTableSchema>;

// Domyślny wiersz tabeli
const defaultRow: BafTableRow = {
  name: '',
  areaType: '',
  areaSize: 0,
};

const BAFTable: React.FC<{
  onBAFDataChange: (totalArea: number, totalBAF: number) => void;
}> = ({ onBAFDataChange }) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<BafTableValues>({
    resolver: zodResolver(bafTableSchema),
    defaultValues: {
      rows: [defaultRow],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows',
  });

  // Przechowujemy współczynniki w stanie
  const [coefficients, setCoefficients] = useState<number[]>([]);

  useEffect(() => {
    setCoefficients(fields.map(() => 0));
  }, [fields.length]);

  const handleSelectChange = (index: number, value: string) => {
    setValue(`rows.${index}.areaType`, value);

    const newCoefficients = [...coefficients];
    newCoefficients[index] = formZagospodarowaniaOptions[value] || 0;
    setCoefficients(newCoefficients);
  };

  useEffect(() => {
    const newCoefficients = getValues('rows').map(
      (row) => formZagospodarowaniaOptions[row.areaType] || 0,
    );
    setCoefficients(newCoefficients);
  }, [getValues, fields]);

  const duplicateRow = (index: number) => {
    const rowValues = getValues(`rows.${index}`);
    append(rowValues);
  };

  const removeRow = (index: number) => {
    // Use the `remove` method instead of `fields.splice`
    // This will handle the form state and re-rendering correctly
    remove(index);

    // After removal, update the coefficients array
    const newCoefficients = fields
      .filter((_, idx) => idx !== index) // Filter out the removed item
      .map(
        (field, idx) =>
          formZagospodarowaniaOptions[getValues(`rows.${idx}.areaType`)] || 0,
      );
    setCoefficients(newCoefficients);
  };

  const [totalArea, setTotalArea] = useState(0);
  const [totalBAF, setTotalBAF] = useState(0);

  const areaSizes = fields.map((_, index) => watch(`rows.${index}.areaSize`));

  useEffect(() => {
    const newTotalArea = areaSizes.reduce(
      (total, size) => total + (Number(size) || 0),
      0,
    );
    const newTotalBAF = areaSizes.reduce(
      (total, size, index) => total + (Number(size) || 0) * coefficients[index],
      0,
    );

    setTotalArea(newTotalArea);
    setTotalBAF(newTotalBAF);

    onBAFDataChange(newTotalArea, newTotalBAF);
  }, [areaSizes, coefficients, onBAFDataChange]);

  const handleAreaSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newValue = event.target.value.replace(/[^0-9.]/g, '');
    if (newValue.startsWith('-')) {
      event.target.value = newValue.slice(1);
    } else {
      event.target.value = newValue;
    }
    setValue(`rows.${index}.areaSize`, parseFloat(event.target.value) || 0);
  };

  return (
    <ScrollArea className="h-full rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">
              <div className="flex justify-start items-center">
                Nazwa
                <HelpPopover content='Nazwa pozwala lepiej zidentyfikować wiersze w tabeli. Jest to opcjonalne pole. Przykłady nazwy to np.: "Drzewa sprzed domu", "Krzewy przy płocie"' />
              </div>
            </TableHead>
            <TableHead className="w-1/4">
              <div className="flex justify-start items-center">
                Forma zagospodarowania
                <HelpPopover
                  htmlContent={
                    <div className="w-[400]">
                      <p className="text-sm">
                        Forma zagospodarowania to różne elementy, które znajdują
                        się na twojej działce.<br></br>Poniżej wypisane są
                        kategorie form zagospodarowań wraz z przykładami oraz
                        korespondującymi im współczynnikami:
                      </p>
                      <Accordion
                        defaultValue="item-1"
                        type="single"
                        collapsible
                      >
                        {surfaces.map((surface, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>
                              <p className="text-sm">{surface.category}</p>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul>
                                {surface.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <p className="text-sm">
                                      {item.name}: {item.value}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  }
                />
              </div>
            </TableHead>
            <TableHead className="w-[210px]">
              <div className="flex justify-start items-center">
                Powierzchnia (m²)
                <HelpPopover content="W każdym wierszu tabeli wpisz ile dana forma zagospodarowania zajmuje miejsca na Twojej działce w m2. Jeśli nie znasz dokładnej wartości, wpisz przybliżoną lub skorzystaj z Kalkulatora BAF Graficznego. Całkowita powierzchnia działki zsumowana jest w ostatnim wierszu tabeli." />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex justify-start items-center">
                Współczynnik
                <HelpPopover content="Współczynnik jest uzupełniany automatycznie na podstawie wybranej Formy zagospodarowania." />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex justify-start items-center">
                BAF (m²)
                <HelpPopover
                  htmlContent={
                    <div>
                      <p className="text-sm">
                        Jest to Powierzchnia (m²) pomnożona przez Współczynnik.
                      </p>
                      <p className="font-bold text-center mt-2">
                        np. 100 (powierzchnia) * 0.5 (współczynnik) = 50
                      </p>
                    </div>
                  }
                />
              </div>
            </TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => {
            const areaSize = watch(`rows.${index}.areaSize`);
            const areaType = watch(`rows.${index}.areaType`);

            const coefficient = formZagospodarowaniaOptions[areaType] || 0;

            const baf = areaSize * coefficient;

            return (
              <TableRow key={field.id}>
                <TableCell>
                  <Input {...register(`rows.${index}.name`)} />
                </TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) => {
                      handleSelectChange(index, value);
                    }}
                    value={areaType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz typ z listy" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(formZagospodarowaniaOptions).map(
                        ([optionValue, _]) => (
                          <SelectItem key={optionValue} value={optionValue}>
                            {optionValue}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    max={999999}
                    {...register(`rows.${index}.areaSize`)}
                    onChange={(event) => handleAreaSizeChange(event, index)}
                  />
                </TableCell>
                <TableCell>{coefficient}</TableCell>
                <TableCell>{baf.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <IconOnlyButton
                    icon={<MaterialSymbol size={24} icon="content_copy" />}
                    hint={'Duplikuj wiersz'}
                    buttonType={{
                      variant: 'default',
                      size: 'default',
                    }}
                    onClick={() => duplicateRow(index)}
                    type="button"
                  />
                  <IconOnlyButton
                    icon={<MaterialSymbol size={24} icon="delete" />}
                    hint={'Usuń wiersz'}
                    buttonType={{
                      variant: 'default',
                      size: 'default',
                    }}
                    onClick={() => removeRow(index)}
                    type="button"
                    className={'ml-2'}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>
              <Button type="button" onClick={() => append(defaultRow)}>
                DODAJ WIERSZ
              </Button>
            </TableCell>
            <TableCell>{totalArea.toFixed(2)} m²</TableCell>
            <TableCell></TableCell>
            <TableCell colSpan={2}>{totalBAF.toFixed(2)} m²</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default BAFTable;
