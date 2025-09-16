import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Service } from '../../services/booking';

declare var anime: any;

@Component({
  selector: 'app-service-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-selection.html',
  styleUrl: './service-selection.scss'
})
export class ServiceSelection implements OnInit, AfterViewInit {
  @ViewChild('servicesContainer', { static: false }) servicesContainer!: ElementRef;
  
  services: Service[] = [];
  selectedService: string | null = null;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.services = this.bookingService.services;
    this.selectedService = this.bookingService.getCurrentState().service;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeFlowerAnimations();
    }, 100);
  }

  selectService(service: Service): void {
    if (this.selectedService === service.name) return;
    
    this.selectedService = service.name;
    this.bookingService.selectService(service.name);
    
    this.animateServiceSelection(service);
    
    // Auto-advance to next step after animation
    setTimeout(() => {
      this.bookingService.goToStep(2);
    }, 1000);
  }

  private initializeFlowerAnimations(): void {
    if (typeof anime === 'undefined') return;
    
    const flowerSVGs = this.servicesContainer.nativeElement.querySelectorAll('.flower-svg');
    
    flowerSVGs.forEach((svg: any) => {
      const petals = svg.querySelectorAll('.petal');
      
      // Initial closed bud state
      anime.set(petals, {
        scale: 0.3,
        translateX: '25px',
        translateY: '25px',
      });
    });
  }

  private animateServiceSelection(selectedService: Service): void {
    if (typeof anime === 'undefined') return;
    
    const allBuds = this.servicesContainer.nativeElement.querySelectorAll('.service-bud');
    
    allBuds.forEach((bud: any) => {
      const svg = bud.querySelector('.flower-svg');
      const petals = svg?.querySelectorAll('.petal');
      const isSelected = bud.dataset.service === selectedService.name;
      
      if (petals) {
        anime({
          targets: petals,
          scale: isSelected ? 1 : 0,
          translateX: isSelected ? 0 : '25px',
          translateY: isSelected ? 0 : '25px',
          duration: 800,
          easing: 'easeInOutExpo',
        });
      }
      
      const text = bud.querySelector('p');
      if (text) {
        anime({
          targets: text,
          opacity: isSelected ? 1 : 0.3,
          translateY: isSelected ? 0 : '10px',
          duration: 500,
          delay: 100
        });
      }
    });
  }

  onServiceHover(service: Service, isEntering: boolean): void {
    if (typeof anime === 'undefined' || this.selectedService === service.name) return;
    
    const serviceBud = this.servicesContainer.nativeElement.querySelector(`[data-service="${service.name}"]`);
    const petals = serviceBud?.querySelector('.flower-svg')?.querySelectorAll('.petal');
    
    if (petals) {
      anime({
        targets: petals,
        scale: isEntering ? 0.35 : 0.3,
        duration: 300,
        easing: 'easeOutQuad'
      });
    }
  }

  createFlowerSVG(service: Service, index: number): string {
    const gradientId = `grad-${index}`;
    
    return `
      <svg class="flower-svg" viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <radialGradient id="${gradientId}">
            <stop offset="0%" stop-color="#FFF" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="${service.budColor}"/>
          </radialGradient>
        </defs>
        ${this.generatePetals(gradientId)}
      </svg>
    `;
  }

  private generatePetals(gradientId: string): string {
    let petals = '';
    for (let i = 0; i < 6; i++) {
      petals += `
        <path class="petal" 
              fill="url(#${gradientId})" 
              d="M 50 0 C 20 20, 20 50, 50 50 C 80 50, 80 20, 50 0 Z" 
              transform-origin="50 50" 
              transform="rotate(${i * 60})">
        </path>
      `;
    }
    return petals;
  }
}
