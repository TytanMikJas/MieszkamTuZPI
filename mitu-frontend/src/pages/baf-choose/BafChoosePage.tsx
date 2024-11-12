import { BAFChooseCalculatorType } from '../baf-simple/components/BAFChooseCalculatorType';

export default function BafChoosePage() {
  return (
    <div className="mx-auto flex items-center flex-col h-full scrollable-vertical">
      <div className="mt-4 2xl:w-1/2 max-w-screen-2xl">
        <BAFChooseCalculatorType
          isRedirectBoth={true}
          isActiveOnSimple={false}
          isActiveOnGraphic={false}
        />
      </div>
    </div>
  );
}
