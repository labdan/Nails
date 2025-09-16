import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Phonenumber } from './phonenumber';

describe('Phonenumber', () => {
  let component: Phonenumber;
  let fixture: ComponentFixture<Phonenumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Phonenumber]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Phonenumber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
