import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientIntakeFormComponent } from '../../components/patient-intake-form/patient-intake-form.component';
import { PatientService } from '../../services/patient.service';
import { PatientIntakePayload } from '../../models/patient-intake.model';

@Component({
  selector: 'vyracare-patient-intake-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PatientIntakeFormComponent],
  templateUrl: './patient-intake.component.html',
  styleUrl: './patient-intake.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientIntakePageComponent {
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal(false);

  constructor(private readonly patientService: PatientService) {}

  handleSubmit(payload: PatientIntakePayload) {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    this.patientService.registerPatient(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Falha ao salvar a ficha do paciente. Tente novamente.');
      }
    });
  }
}
