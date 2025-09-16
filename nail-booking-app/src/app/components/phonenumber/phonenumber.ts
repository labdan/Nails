import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking';

declare var anime: any;

@Component({
  selector: 'app-phonenumber',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phonenumber.html',
  styleUrl: './phonenumber.scss'
})
export class Phonenumber implements OnInit, AfterViewInit {
  countryCode = '+1'; // Default to US
  phoneNumber = '';
  
  countryCodes = [
    { code: '+1', country: 'US/CA' },
    { code: '+44', country: 'UK' },
    { code: '+33', country: 'FR' },
    { code: '+49', country: 'DE' },
    { code: '+39', country: 'IT' },
    { code: '+34', country: 'ES' },
    { code: '+31', country: 'NL' },
    { code: '+46', country: 'SE' },
    { code: '+47', country: 'NO' },
    { code: '+45', country: 'DK' }
  ];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    const state = this.bookingService.getCurrentState();
    if (state.details.phone) {
      // Parse existing phone number if available
      const phone = state.details.phone;
      const countryCodeMatch = phone.match(/^(\+\d{1,3})/);
      if (countryCodeMatch) {
        this.countryCode = countryCodeMatch[1];
        this.phoneNumber = phone.replace(countryCodeMatch[1], '').trim();
      } else {
        this.phoneNumber = phone;
      }
    }
  }

  ngAfterViewInit(): void {
    this.animateWelcome();
  }

  onPhoneChange(): void {
    const fullPhoneNumber = `${this.countryCode} ${this.phoneNumber}`.trim();
    this.bookingService.updateUserDetails({ phone: fullPhoneNumber });
  }

  isPhoneValid(): boolean {
    return this.phoneNumber.length >= 7; // Minimum phone number length
  }

  private animateWelcome(): void {
    if (typeof anime !== 'undefined') {
      setTimeout(() => {
        const elements = document.querySelectorAll('.welcome-element');
        if (elements.length > 0) {
          anime({
            targets: elements,
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(200),
            duration: 800,
            easing: 'easeOutExpo'
          });
        }
      }, 100);
    }
  }
}
