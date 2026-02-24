import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientIntakePageComponent } from '../patient-intake/patient-intake.component';

@Component({
  selector: 'vyracare-employee-registration-page',
  standalone: true,
  imports: [CommonModule, PatientIntakePageComponent],
  templateUrl: './employee-registration.component.html',
  styleUrl: './employee-registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeRegistrationPageComponent {
}
