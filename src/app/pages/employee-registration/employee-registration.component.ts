import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PatientIntakePageComponent } from '../patient-intake/patient-intake.component';

@Component({
  selector: 'vyracare-employee-registration-page',
  standalone: true,
  imports: [PatientIntakePageComponent],
  templateUrl: './employee-registration.component.html',
  styleUrl: './employee-registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeRegistrationPageComponent {
}
