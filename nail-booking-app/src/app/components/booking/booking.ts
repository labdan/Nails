import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BookingService, BookingState } from '../../services/booking';
import { ServiceSelection } from '../service-selection/service-selection';
import { DateTimePicker } from '../date-time-picker/date-time-picker';
import { UserDetails } from '../user-details/user-details';
import { Confirmation } from '../confirmation/confirmation';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ServiceSelection, DateTimePicker, UserDetails, Confirmation],
  templateUrl: './booking.html',
  styleUrl: './booking.scss'
})
export class BookingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  bookingState: BookingState = {
    currentStep: 1,
    service: null,
    date: null,
    time: null,
    details: { name: '', email: '', phone: '' }
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.bookingState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.bookingState = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToStep(step: number): void {
    this.bookingService.goToStep(step);
  }

  nextStep(): void {
    const nextStep = this.bookingState.currentStep + 1;
    if (nextStep <= 4) {
      this.goToStep(nextStep);
    }
  }

  previousStep(): void {
    const prevStep = this.bookingState.currentStep - 1;
    if (prevStep >= 1) {
      this.goToStep(prevStep);
    }
  }

  canProceed(): boolean {
    return this.bookingService.isStepValid(this.bookingState.currentStep);
  }

  showBackButton(): boolean {
    return this.bookingState.currentStep > 1 && this.bookingState.currentStep < 4;
  }

  showNextButton(): boolean {
    return this.bookingState.currentStep < 4;
  }

  getNextButtonText(): string {
    return this.bookingState.currentStep === 3 ? 'Confirm Booking' : 'Next';
  }
}
