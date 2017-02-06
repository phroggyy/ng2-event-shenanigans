import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Moment} from 'moment';
import * as moment from 'moment';
import {DateRange} from '../../models/DateRange';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  currentView: Moment = moment()
  selected: DateRange = new DateRange();

  @Input()
  rangeInput:boolean = false;

  @Output()
  selection: EventEmitter<DateRange> = new EventEmitter;
  private hovering: Moment = null;

  constructor() {
  }

  ngOnInit() {
  }

  daysInMonthByWeek(): Array<{days: Array<Moment>}> {
    let lastMonth:Array<Moment> = Array.from({length: (this.currentView.clone().startOf('month').weekday() + 6) % 7}, (_, index) => {
      return this.currentView.clone().subtract(1, 'month').endOf('month').subtract(index, 'days')
    }).reverse();
    let thisMonth:Array<Moment> = Array.from({length: this.currentView.daysInMonth()}, (value, key) => this.currentView.clone().date(key + 1));
    let nextMonth:Array<Moment> = Array.from({length: (7 - this.currentView.clone().endOf('month').weekday()) % 7}, (_, index) => {
      return this.currentView.clone().add(1, 'month').startOf('month').add(index, 'days')
    });

    return lastMonth.concat(thisMonth).concat(nextMonth)
      .reduce((previousValue: Array<Array<Moment>>, currentValue: Moment, currentIndex: number) => {
        if (currentIndex % 7 === 0) {
          previousValue.push([currentValue])
          return previousValue
        }

        previousValue[previousValue.length - 1].push(currentValue)
        return previousValue
      }, [])
      .map(week => {
        return {days: week}
      })
  }

  lastMonth() {
    this.switchMonth(-1)
  }

  nextMonth() {
    this.switchMonth(1)
  }

  switchMonth(amount) {
    this.currentView.add(amount, 'months')
  }

  selectedDate(date:Moment) {
    console.log('date selected')
    if (! (this.selected.from && this.rangeInput && date.isBefore(this.selected.from))) {
      this.selected.from = date;
    } else {
      this.selected.to = date;
    }

    this.selection.emit(this.selected)
  }

  hoveredDate(date: Moment) {
    console.log('hovered')
    this.hovering = date
  }

  dehoveredDate() {
    console.log('dehovered')
    this.hovering = null
  }

  shouldIndicateRange(date:Moment) {
    if (! this.selected.from) {
      return false
    }

    if (! this.hovering) {
      return false;
    }

    return date.isBetween(this.selected.from, this.hovering);
  }
}
