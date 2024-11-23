import { useInvestmentStore } from '../../../../core/stores/investment-store';
import FilterButton from '../../../../reusable-components/FilterButton/FilterButton';
import {
  FILTER_BUTTON_LABEL,
  INVESTMENT_FILTERS_SECTION_STATUS_LABEL,
  INVESTMENT_STATUS_LABEL_APPROVED,
  INVESTMENT_STATUS_LABEL_COMPLETED,
  INVESTMENT_STATUS_LABEL_IN_PROGRESS,
  INVESTMENT_STATUS_LABEL_PENDING,
  INVESTMENT_STATUS_LABEL_REJECTED,
  INVESTMENT_STATUS_NAME_APPROVED,
  INVESTMENT_STATUS_NAME_COMPLETED,
  INVESTMENT_STATUS_NAME_IN_PROGRESS,
  INVESTMENT_STATUS_NAME_PENDING,
  INVESTMENT_STATUS_NAME_REJECTED,
} from '../../../../strings';

export default function InvestmentFilter() {
  const { setFilterParams } = useInvestmentStore();

  const filters = {
    [INVESTMENT_FILTERS_SECTION_STATUS_LABEL]: [
      INVESTMENT_STATUS_LABEL_PENDING,
      INVESTMENT_STATUS_LABEL_IN_PROGRESS,
      INVESTMENT_STATUS_LABEL_COMPLETED,
      INVESTMENT_STATUS_LABEL_APPROVED,
      INVESTMENT_STATUS_LABEL_REJECTED,
    ],
  };

  const parsedFilters: any = {
    [INVESTMENT_STATUS_LABEL_PENDING]: INVESTMENT_STATUS_NAME_PENDING,
    [INVESTMENT_STATUS_LABEL_IN_PROGRESS]: INVESTMENT_STATUS_NAME_IN_PROGRESS,
    [INVESTMENT_STATUS_LABEL_COMPLETED]: INVESTMENT_STATUS_NAME_COMPLETED,
    [INVESTMENT_STATUS_LABEL_APPROVED]: INVESTMENT_STATUS_NAME_APPROVED,
    [INVESTMENT_STATUS_LABEL_REJECTED]: INVESTMENT_STATUS_NAME_REJECTED,
  };

  const filterParser = (filters: string[]): string[] => {
    return filters.map((filter) => parsedFilters[filter]);
  };

  return (
    <div data-testId="investments-filter">
      <FilterButton
        title={FILTER_BUTTON_LABEL}
        menuAlignment="start"
        filters={filters}
        callback={(filters) => setFilterParams(filterParser(filters))}
        buttonType={{ variant: 'outline', size: 'lg' }}
      />
    </div>
  );
}
