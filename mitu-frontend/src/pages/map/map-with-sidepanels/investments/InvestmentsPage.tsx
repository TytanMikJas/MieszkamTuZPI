import InvestmentFilter from './InvestmentFilter';
import InvestmentSorting from './InvestmentSorting';
import InvestmentsList from './InvestmentsList';
import { useEffect } from 'react';
import { useInvestmentStore } from '@/core/stores/investment-store';

type Props = object;

function InvestmentsPage({}: Props) {
  const { resetList, setResetList } = useInvestmentStore();
  useEffect(() => {
    if (!resetList) return;
    setResetList(false);
    window.location.reload();
  }, [resetList]);
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row justify-around p-3">
        <InvestmentFilter />
        <InvestmentSorting />
      </div>
      <InvestmentsList />
    </div>
  );
}

export default InvestmentsPage;
