import CommentablePostSentimentOutputDTO from '@/core/api/sentiment/sentiment';
import SentimentBarChart from './SentimentBarChart';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shadcn/carousel';
import Truncate from '../misc/truncate/Truncate';

type Props = {
  data: CommentablePostSentimentOutputDTO;
};

function SentimentAnalysisResultsComponent({ data }: Props) {
  function getSentimentDescription() {
    switch (data.sentiment.description) {
      case 'positive':
        return 'pozytywnie';
      case 'negative':
        return 'negatywnie';
      case 'neutral':
        return 'neutralnie';
      default:
        return 'mieszane';
    }
  }
  function getColorClass() {
    switch (data.sentiment.description) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      case 'neutral':
        return 'text-gray-500';
      default:
        return 'text-yellow-500';
    }
  }

  return (
    <div>
      <p className="text-lg">
        Użytkownicy wyrażają się o tym poście raczej{' '}
        <b className={getColorClass()}>{getSentimentDescription()}</b>
      </p>
      <SentimentBarChart
        positive={data.sentiment.positive}
        negative={data.sentiment.negative}
        neutral={data.sentiment.neutral}
        mixed={data.sentiment.mixed}
      />
      <div className="*:mt-3">
        {data.topPositiveComments.length > 0 && (
          <div className="">
            <p className="text-lg font-bold text-center">
              Wybrane pozytywne komentarze
            </p>
            <Carousel>
              <CarouselContent>
                {data.topPositiveComments.map((comment, index) => (
                  <CarouselItem key={index}>
                    <div className="text-center">
                      <Truncate tooltip text={comment.text} length={255} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext />
              <CarouselPrevious />
            </Carousel>
          </div>
        )}
        {data.topNegativeComments.length > 0 && (
          <div className="">
            <p className="text-lg font-bold text-center">
              Wybrane negatywne komentarze
            </p>
            <Carousel>
              <CarouselContent>
                {data.topNegativeComments.map((comment, index) => (
                  <CarouselItem key={index}>
                    <div className="text-center">
                      <Truncate tooltip text={comment.text} length={255} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext />
              <CarouselPrevious />
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
}

export default SentimentAnalysisResultsComponent;
