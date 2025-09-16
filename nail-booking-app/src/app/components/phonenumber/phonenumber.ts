import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BookingService } from '../../services/booking';

declare var anime: any;

interface CountryCode {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
}

@Component({
  selector: 'app-phonenumber',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phonenumber.html',
  styleUrl: './phonenumber.scss'
})
export class Phonenumber implements OnInit, AfterViewInit {
  countryCode = '+49'; // Default to Germany
  phoneNumber = '';
  countryCodes: CountryCode[] = [];
  isLoading = true;

  constructor(private bookingService: BookingService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCountryCodes();
    
    const state = this.bookingService.getCurrentState();
    if (state.details.phone) {
      // Parse existing phone number if available
      const phone = state.details.phone;
      const countryCodeMatch = phone.match(/^(\+\d{1,4})/);
      if (countryCodeMatch) {
        this.countryCode = countryCodeMatch[1];
        this.phoneNumber = phone.replace(countryCodeMatch[1], '').trim();
      } else {
        this.phoneNumber = phone;
      }
    }
  }

  private loadCountryCodes(): void {
    console.log('Loading country codes...');
    this.http.get<CountryCode[]>('/assets/countrycodes.json').subscribe({
      next: (data) => {
        console.log('Country codes loaded successfully:', data.length, 'countries');
        this.countryCodes = data;
        this.isLoading = false;
        
        // Set Germany as default if no phone number exists yet
        const state = this.bookingService.getCurrentState();
        if (!state.details.phone) {
          this.countryCode = '+49'; // Germany
        }
      },
      error: (error) => {
        console.error('Error loading country codes:', error);
        console.log('Using fallback country list');
        // Fallback to a basic list if file loading fails
        this.countryCodes = [
          { name: 'Germany', flag: '🇩🇪', code: 'DE', dial_code: '+49' },
          { name: 'United States', flag: '🇺🇸', code: 'US', dial_code: '+1' },
          { name: 'United Kingdom', flag: '🇬🇧', code: 'GB', dial_code: '+44' },
          { name: 'France', flag: '🇫🇷', code: 'FR', dial_code: '+33' },
          { name: 'Spain', flag: '🇪🇸', code: 'ES', dial_code: '+34' },
          { name: 'Italy', flag: '🇮🇹', code: 'IT', dial_code: '+39' }
        ];
        this.isLoading = false;
      }
    });
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
