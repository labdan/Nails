import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookingComponent } from './components/booking/booking';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BookingComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Nail Booking App');
}
