import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService, BookingState } from '../../services/booking';

declare var anime: any;

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss'
})
export class UserDetails implements OnInit, AfterViewInit {
  userDetails = {
    name: '',
    email: '',
    phone: ''
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    const state = this.bookingService.getCurrentState();
    this.userDetails = { ...state.details };
  }

  ngAfterViewInit(): void {
    this.animateForm();
  }

  onInputChange(): void {
    this.bookingService.updateUserDetails(this.userDetails);
  }

  isFormValid(): boolean {
    return !!(this.userDetails.name.trim() && this.userDetails.email.trim());
  }

  private animateForm(): void {
    if (typeof anime !== 'undefined') {
      setTimeout(() => {
        const formFields = document.querySelectorAll('.form-field');
        if (formFields.length > 0) {
          anime({
            targets: formFields,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(200),
            easing: 'easeOutExpo',
            duration: 800
          });
        }
      }, 100);
    }
  }
}
