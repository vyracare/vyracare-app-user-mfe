import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VcButtonComponent, VcHeadingComponent, VcTextComponent } from '@vyracare/design-system';
import { PatientIntakeFormComponent } from '../../components/patient-intake-form/patient-intake-form.component';
import { Patient, PatientIntakePayload, PatientNote } from '../../models/patient-intake.model';
import { AccessControlService } from '../../services/access-control.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'vyracare-patient-edit-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PatientIntakeFormComponent, VcButtonComponent, VcHeadingComponent, VcTextComponent],
  templateUrl: './patient-edit-page.component.html',
  styleUrl: './patient-edit-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientEditPageComponent implements OnInit {
  readonly patient = signal<Patient | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly noteModalOpen = signal(false);
  readonly historyModalOpen = signal(false);
  readonly notes = signal<PatientNote[]>([]);
  readonly isAdministrator: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly patientService: PatientService,
    accessControl: AccessControlService
  ) {
    this.isAdministrator = accessControl.isAdministrator();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Paciente nao informado.');
      this.loading.set(false);
      return;
    }
    this.patientService.getPatient(id).subscribe({
      next: patient => {
        this.patient.set(patient);
        this.notes.set(patient.professionalNotes ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nao foi possivel carregar a ficha do paciente.');
        this.loading.set(false);
      }
    });
  }

  update(payload: PatientIntakePayload): void {
    const patient = this.patient();
    if (!patient || !this.isAdministrator) return;
    this.saving.set(true);
    this.error.set('');
    this.patientService.updatePatient(patient.id, payload).subscribe({
      next: updated => {
        this.patient.set(updated);
        this.saving.set(false);
        this.success.set('Ficha atualizada com sucesso.');
      },
      error: error => {
        this.saving.set(false);
        this.error.set(error?.status === 403 ? 'Somente administradores podem alterar a ficha.' : 'Nao foi possivel atualizar a ficha.');
      }
    });
  }

  formValue(patient: Patient): PatientIntakePayload {
    const { id: _id, professionalNotes: _professionalNotes, createdAt: _createdAt, updatedAt: _updatedAt, ...payload } = patient;
    return payload;
  }

  saveNote(content: string, procedureName: string): void {
    const patient = this.patient();
    if (!patient || !content.trim()) {
      this.error.set('Informe a nota profissional.');
      return;
    }
    this.patientService.addNote(patient.id, { content: content.trim(), procedureName: procedureName.trim() || undefined }).subscribe({
      next: note => {
        this.notes.update(notes => [note, ...notes]);
        this.noteModalOpen.set(false);
        this.success.set('Nota adicionada ao historico.');
      },
      error: () => this.error.set('Nao foi possivel adicionar a nota.')
    });
  }
}
