import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { VcCardComponent, VcHeadingComponent, VcTextComponent, VcToastService } from '@vyracare/design-system';
import { PatientIntakeFormComponent } from '../../components/patient-intake-form/patient-intake-form.component';
import { PatientService } from '../../services/patient.service';
import { PatientIntakePayload } from '../../models/patient-intake.model';

@Component({
  selector: 'vyracare-patient-intake-page',
  standalone: true,
  imports: [RouterLink, PatientIntakeFormComponent, VcCardComponent, VcHeadingComponent, VcTextComponent],
  templateUrl: './patient-intake.component.html',
  styleUrl: './patient-intake.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/** Coordena a persistencia e os feedbacks da ficha inicial do paciente. */
export class PatientIntakePageComponent {
  protected readonly loading = signal(false);

  constructor(
    private readonly patientService: PatientService,
    private readonly router: Router,
    private readonly toast: VcToastService
  ) {}

  /** Envia a ficha validada para a API e atualiza o feedback da pagina. */
  handleSubmit(payload: PatientIntakePayload): void {
    this.loading.set(true);

    this.patientService.registerPatient(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('Paciente cadastrado', 'A ficha foi salva com sucesso.');
        void this.router.navigate(['/pacientes']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.toast.error('Nao foi possivel cadastrar o paciente', this.resolveErrorMessage(error));
      }
    });
  }

  /** Converts API failures into clear feedback without exposing implementation details. */
  private resolveErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 409) return 'Ja existe um paciente cadastrado com este CPF.';
    if (error.status === 401) return 'Sua sessao expirou. Entre novamente para continuar.';
    return 'Revise os dados e tente novamente.';
  }
}
