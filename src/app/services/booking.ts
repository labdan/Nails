import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Service {
  name: string;
  budColor: string;
  bloomColor: string;
}

export interface BookingState {
  currentStep: number;
  service: string | null;
  date: string | null;
  time: string | null;
  details: {
    name: string;
    email: string;
    phone: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingStateSubject = new BehaviorSubject<BookingState>({
    currentStep: 1,
    service: null,
    date: null,
    time: null,
    details: {
      name: '',
      email: '',
      phone: ''
    }
  });

  public bookingState$ = this.bookingStateSubject.asObservable();

  public services: Service[] = [
    { name: 'Classic Manicure', budColor: '#fecaca', bloomColor: '#f87171' },
    { name: 'Gel Manicure', budColor: '#fed7aa', bloomColor: '#fb923c' },
    { name: 'Acrylic Extensions', budColor: '#bfdbfe', bloomColor: '#60a5fa' },
    { name: 'Nail Art', budColor: '#d8b4fe', bloomColor: '#c084fc' },
    { name: 'Pedicure', budColor: '#bbf7d0', bloomColor: '#4ade80' },
    { name: 'Spa Treatment', budColor: '#fef08a', bloomColor: '#facc15' },
  ];

  public timeSlots: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  getCurrentState(): BookingState {
    return this.bookingStateSubject.value;
  }

  updateBookingState(updates: Partial<BookingState>): void {
    const currentState = this.getCurrentState();
    this.bookingStateSubject.next({ ...currentState, ...updates });
  }

  selectService(serviceName: string): void {
    this.updateBookingState({ service: serviceName });
  }

  selectDateTime(date: string, time: string): void {
    this.updateBookingState({ date, time });
  }

  updateUserDetails(details: Partial<BookingState['details']>): void {
    const currentState = this.getCurrentState();
    this.updateBookingState({ 
      details: { ...currentState.details, ...details }
    });
  }

  goToStep(step: number): void {
    this.updateBookingState({ currentStep: step });
  }

  resetBooking(): void {
    this.bookingStateSubject.next({
      currentStep: 1,
      service: null,
      date: null,
      time: null,
      details: {
        name: '',
        email: '',
        phone: ''
      }
    });
  }

  isStepValid(step: number): boolean {
    const state = this.getCurrentState();
    switch (step) {
      case 1:
        return !!state.details.phone && state.details.phone.length >= 10; // Phone number step
      case 2:
        return !!state.service; // Service selection step
      case 3:
        return !!state.date && !!state.time; // Date & time step
      case 4:
        return !!state.details.name && !!state.details.email; // User details step
      default:
        return false;
    }
  }
}
