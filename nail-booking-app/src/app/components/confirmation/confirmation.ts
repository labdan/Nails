import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, BookingState } from '../../services/booking';

declare var anime: any;

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss'
})
export class Confirmation implements OnInit, AfterViewInit {
  @ViewChild('confirmationFlower', { static: false }) confirmationFlower!: ElementRef;
  
  bookingDetails: BookingState = {
    currentStep: 4,
    service: null,
    date: null,
    time: null,
    details: { name: '', email: '', phone: '' }
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingDetails = this.bookingService.getCurrentState();
  }

  ngAfterViewInit(): void {
    this.showConfirmationAnimation();
  }

  get formattedDate(): string {
    if (!this.bookingDetails.date) return '';
    
    const date = new Date(this.bookingDetails.date);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  private showConfirmationAnimation(): void {
    if (typeof anime === 'undefined') return;
    
    // Create and animate the confirmation flower
    const flowerContainer = this.confirmationFlower.nativeElement;
    flowerContainer.innerHTML = this.createConfirmationFlowerSVG();
    
    const finalFlower = flowerContainer.querySelector('.confirmation-flower-svg');
    const petals = finalFlower?.querySelectorAll('.petal');
    
    if (petals) {
      // Set initial state
      anime.set(petals, {
        scale: 0
      });

      // Animate petals blooming
      anime({
        targets: petals,
        scale: 1,
        rotate: '+=15',
        duration: 1500,
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .5)'
      });
    }
  }

  private createConfirmationFlowerSVG(): string {
    return `
      <svg class="confirmation-flower-svg" viewBox="0 0 100 100" width="150" height="150">
        <defs>
          <radialGradient id="conf-grad">
            <stop offset="0%" stop-color="#FFF" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#d8b4fe"/>
          </radialGradient>
        </defs>
        ${this.generateConfirmationPetals()}
      </svg>
    `;
  }

  private generateConfirmationPetals(): string {
    let petals = '';
    for (let i = 0; i < 6; i++) {
      petals += `
        <path class="petal" 
              fill="url(#conf-grad)" 
              d="M 50 0 C 20 20, 20 50, 50 50 C 80 50, 80 20, 50 0 Z" 
              transform-origin="50 50" 
              transform="rotate(${i * 60})">
        </path>
      `;
    }
    return petals;
  }

  startNewBooking(): void {
    this.bookingService.resetBooking();
  }
}
