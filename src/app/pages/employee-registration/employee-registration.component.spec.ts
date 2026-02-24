import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EmployeeRegistrationPageComponent } from './employee-registration.component';

describe('EmployeeRegistrationPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRegistrationPageComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EmployeeRegistrationPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
