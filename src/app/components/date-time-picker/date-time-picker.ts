import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking';

declare var anime: any;

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  dateString: string;
}

@Component({
  selector: 'app-date-time-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-time-picker.html',
  styleUrl: './date-time-picker.scss'
})
export class DateTimePicker implements OnInit, AfterViewInit {
  currentDate = new Date();
  calendarDays: CalendarDay[] = [];
  timeSlots: string[] = [];
  selectedDate: string | null = null;
  selectedTime: string | null = null;
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    const state = this.bookingService.getCurrentState();
    this.selectedDate = state.date;
    this.selectedTime = state.time;
    this.timeSlots = this.bookingService.timeSlots;
    this.generateCalendar();
  }

  ngAfterViewInit(): void {
    if (this.selectedDate) {
      setTimeout(() => this.renderTimeSlots(), 100);
    }
  }

  get currentMonthYear(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    this.calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(year, month, -firstDayOfWeek + i + 1);
      this.calendarDays.push({
        date: prevDate,
        day: prevDate.getDate(),
        isCurrentMonth: false,
        isDisabled: true,
        isSelected: false,
        dateString: ''
      });
    }
    
    // Add days of the current month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isDisabled = date < today;
      
      this.calendarDays.push({
        date,
        day,
        isCurrentMonth: true,
        isDisabled,
        isSelected: this.selectedDate === dateString,
        dateString
      });
    }
  }

  selectDate(calendarDay: CalendarDay): void {
    if (calendarDay.isDisabled || !calendarDay.isCurrentMonth) return;
    
    // Update selection
    this.calendarDays.forEach(day => day.isSelected = false);
    calendarDay.isSelected = true;
    this.selectedDate = calendarDay.dateString;
    
    // Clear time selection when date changes
    this.selectedTime = null;
    
    this.renderTimeSlots();
  }

  selectTime(time: string): void {
    this.selectedTime = time;
    this.bookingService.selectDateTime(this.selectedDate!, time);
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  private renderTimeSlots(): void {
    if (typeof anime !== 'undefined') {
      setTimeout(() => {
        const timeSlotElements = document.querySelectorAll('.time-slot');
        if (timeSlotElements.length > 0) {
          anime({
            targets: timeSlotElements,
            translateY: [-30, 0],
            opacity: [0, 1],
            delay: anime.stagger(100, { start: 100 }),
            easing: 'easeOutElastic(1, .8)',
            duration: 600
          });
        }
      }, 50);
    }
  }
}
