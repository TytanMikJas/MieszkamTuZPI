import moment from 'moment/min/moment-with-locales';

import { DATE_FORMAT } from './constants';

export const daysFromNow = (date: string) => {
  return moment(date).locale('pl').fromNow();
};
export const formatDate = (date: string) => {
  return moment(date).locale('pl').format(DATE_FORMAT);
};
