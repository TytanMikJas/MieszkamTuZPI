import { useNavigate } from 'react-router-dom';
import { useInvestmentStore } from '../../../../core/stores/investment-store';
import InvestmentCard from '../../../../reusable-components/cards/investment-card/InvestmentCard';
import InfiniteList from '../../../../reusable-components/containers/InfiniteList/InfiniteList';
import { ROUTES } from '../../../../core/routing/Router';
export default function InvestmentsList() {
  const navigate = useNavigate();
  const {
    investmentsList,
    fetchInvestmentsList,
    isMoreList,
    selectCardLoadingList,
    performVoteList,
  } = useInvestmentStore();

  const handleClick = (slug: string) => {
    navigate(ROUTES.MAP.INVESTMENT.BY_NAME.path(slug));
  };

  return (
    <div className="flex flex-col w-full h-full items-center scrollable-vertical">
      <InfiniteList loadMore={fetchInvestmentsList} isMore={isMoreList}>
        <div
          className="flex-grow grid grid-cols-1 grid-rows-[auto_1fr] md:grid-cols-2 gap-6 py-2"
          data-testid="investments-list"
        >
          {investmentsList.map((investment, index) => (
            <InvestmentCard
              key={index}
              investment={investment}
              selectCardLoadingList={selectCardLoadingList}
              performVoteList={performVoteList}
              onClick={() => handleClick(investment.slug)}
            />
          ))}
        </div>
      </InfiniteList>
    </div>
  );
}
