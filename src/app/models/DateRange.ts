import {Moment} from 'moment';
export class DateRange {
  constructor(public from: Moment = null,
              public to: Moment = null) {
  }
}