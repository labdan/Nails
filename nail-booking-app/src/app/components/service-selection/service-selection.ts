import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Service } from '../../services/booking';

declare var anime: any;

interface ServiceWithIcon extends Service {
  iconIndex: number;
}

@Component({
  selector: 'app-service-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-selection.html',
  styleUrl: './service-selection.scss'
})
export class ServiceSelection implements OnInit, AfterViewInit {
  @ViewChild('servicesContainer', { static: false }) servicesContainer!: ElementRef;
  
  services: ServiceWithIcon[] = [];
  selectedService: string | null = null;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    // Map services to include icon indices (0-5 for the 6 icons in the sprite)
    this.services = this.bookingService.services.map((service, index) => ({
      ...service,
      iconIndex: index
    }));
    this.selectedService = this.bookingService.getCurrentState().service;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeIconAnimations();
    }, 100);
  }

  selectService(service: ServiceWithIcon): void {
    if (this.selectedService === service.name) return;
    
    this.selectedService = service.name;
    this.bookingService.selectService(service.name);
    
    this.animateServiceSelection(service);
    
    // Auto-advance to next step after animation
    setTimeout(() => {
      this.bookingService.goToStep(3);
    }, 800);
  }

  private initializeIconAnimations(): void {
    if (typeof anime === 'undefined') return;
    
    const serviceIcons = this.servicesContainer.nativeElement.querySelectorAll('.service-icon');
    
    // Set initial state for icons
    anime.set(serviceIcons, {
      scale: 0.8,
      opacity: 0.7
    });

    // Animate icons in
    anime({
      targets: serviceIcons,
      scale: 1,
      opacity: 1,
      delay: anime.stagger(100),
      duration: 600,
      easing: 'easeOutElastic(1, .8)'
    });
  }

  private animateServiceSelection(selectedService: ServiceWithIcon): void {
    if (typeof anime === 'undefined') return;
    
    const allBuds = this.servicesContainer.nativeElement.querySelectorAll('.service-bud');
    
    allBuds.forEach((bud: any) => {
      const icon = bud.querySelector('.service-icon');
      const text = bud.querySelector('p');
      const isSelected = bud.dataset.service === selectedService.name;
      
      if (icon) {
        anime({
          targets: icon,
          scale: isSelected ? 1.2 : 0.6,
          opacity: isSelected ? 1 : 0.3,
          rotate: isSelected ? '360deg' : '0deg',
          duration: 600,
          easing: 'easeInOutExpo',
        });
      }
      
      if (text) {
        anime({
          targets: text,
          opacity: isSelected ? 1 : 0.3,
          scale: isSelected ? 1.1 : 0.9,
          duration: 500,
          delay: 100
        });
      }
    });
  }

  onServiceHover(service: ServiceWithIcon, isEntering: boolean): void {
    if (typeof anime === 'undefined' || this.selectedService === service.name) return;
    
    const serviceBud = this.servicesContainer.nativeElement.querySelector(`[data-service="${service.name}"]`);
    const icon = serviceBud?.querySelector('.service-icon');
    
    if (icon) {
      anime({
        targets: icon,
        scale: isEntering ? 1.1 : 1,
        duration: 300,
        easing: 'easeOutQuad'
      });
    }
  }

  getIconPosition(iconIndex: number): { x: number, y: number } {
    // Assuming the icons are arranged in a 3x2 grid or 2x3 grid
    // You may need to adjust these values based on the actual layout of your sprite
    const iconsPerRow = 3; // Adjust based on your sprite layout
    const iconWidth = 100; // Adjust based on your sprite icon width
    const iconHeight = 100; // Adjust based on your sprite icon height
    
    const row = Math.floor(iconIndex / iconsPerRow);
    const col = iconIndex % iconsPerRow;
    
    return {
      x: col * iconWidth,
      y: row * iconHeight
    };
  }
}
