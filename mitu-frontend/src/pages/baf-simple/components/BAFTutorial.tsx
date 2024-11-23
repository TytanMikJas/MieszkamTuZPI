import React, { useMemo, useState, useEffect } from 'react';
import IconOnlyButton from '@/reusable-components/IconOnlyButton';
import { MaterialSymbol } from 'react-material-symbols';
import HelpPopover from '@/reusable-components/HelpPopover';
import { Card, CardTitle, CardHeader, CardContent } from '@/shadcn/card';
import { Button } from '@/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/dialog';
import { BAFChooseCalculatorType } from './BAFChooseCalculatorType';

interface BAFChooseCalculatorTypeProps {
  isRedirectBoth: boolean;
  isActiveOnSimple: boolean;
  isActiveOnGraphic: boolean;
}

export function BAFTutorial({
  isRedirectBoth,
  isActiveOnSimple,
  isActiveOnGraphic,
}: BAFChooseCalculatorTypeProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconOnlyButton
          icon={<MaterialSymbol size={36} icon="question_mark" color="white" />}
          hint={'Pomoc oraz typ kalkulatora'}
          buttonType={{
            variant: 'default',
            size: 'default',
          }}
          className={'ml-4'}
          type="button"
        />
      </DialogTrigger>
      <DialogContent className="h-[100vh] md:h-[95vh] 2xl:h-[90vh] max-w-screen md:w-1/2 overflow-auto scrollable-vertical">
        <BAFChooseCalculatorType
          isRedirectBoth={isRedirectBoth}
          isActiveOnSimple={isActiveOnSimple}
          isActiveOnGraphic={isActiveOnGraphic}
        />
      </DialogContent>
    </Dialog>
  );
}

export default BAFTutorial;
