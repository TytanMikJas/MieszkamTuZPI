import { MLN_SHORTENING, THOUSAND_SHORTENING } from '../../../strings';

export default function ShortNumber({ number }: { number: number }) {
  let shortenedNumber = `${number}`;

  if (number >= 1e6) {
    shortenedNumber = (number / 1e6).toFixed(1) + ` ${MLN_SHORTENING}`;
  } else if (number >= 1e3) {
    shortenedNumber = (number / 1e3).toFixed(1) + ` ${THOUSAND_SHORTENING}`;
  }

  return <>{shortenedNumber}</>;
}
