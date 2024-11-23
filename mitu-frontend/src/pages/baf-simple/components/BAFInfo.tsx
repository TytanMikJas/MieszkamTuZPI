import React, { useMemo, useState, useEffect } from 'react';
import IconOnlyButton from '@/reusable-components/IconOnlyButton';
import { MaterialSymbol } from 'react-material-symbols';
import HelpPopover from '@/reusable-components/HelpPopover';
import { Button } from '@/shadcn/button';
import IconLoopStandard from '@/reusable-components/lordicon/IconLoopStandard';
import IconPlayOnce from '@/reusable-components/lordicon/IconPlayOnce';
import bafCalculatorIcon from '@/lordicon/bafCalculatorIcon.json';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/dialog';
import { BAFInfoTabs } from './BAFInfoTabs';

export function BAFInfo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconOnlyButton
          icon={<MaterialSymbol size={36} icon="info" color="white" />}
          hint={'Więcej informacji'}
          buttonType={{
            variant: 'default',
            size: 'default',
          }}
          className={'ml-4'}
          type="button"
        />
      </DialogTrigger>
      <DialogContent className="h-[100vh] md:h-[95vh] 2xl:h-[80vh] max-w-screen md:w-1/2 overflow-auto scrollable-vertical">
        <div className="flex flex-col items-center text-center text-base">
          <h1 className="text-2xl font-medium">Informacje o BAF</h1>
          <p className="w-5/6 font-medium pt-2">
            Dowiedz się czym jest BAF oraz dlaczego warto go obliczać.
          </p>

          <div className="flex flex-row items-start pb-2">
            <IconPlayOnce
              icon={bafCalculatorIcon}
              sizes={{ sm: 100, md: 150, lg: 200 }}
            ></IconPlayOnce>
          </div>

          <div className="flex flex-row items-start pb-2"></div>

          <div className="w-11/12 text-left h-max">
            <BAFInfoTabs />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BAFInfo;
