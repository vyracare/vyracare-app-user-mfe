import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VcButtonComponent, VcHeadingComponent, VcTextComponent } from '@vyracare/design-system';
import { PatientIntakeFormComponent } from '../../components/patient-intake-form/patient-intake-form.component';
import { Patient, PatientIntakePayload, PatientNote, PatientUpdatePayload } from '../../models/patient-intake.model';
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
/** Coordena a leitura e a edicao autorizada da ficha de um paciente. */
export class PatientEditPageComponent implements OnInit {
  readonly patient = signal<Patient | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly noteModalOpen = signal(false);
  readonly historyModalOpen = signal(false);
  readonly confirmationModalOpen = signal(false);
  readonly pendingUpdate = signal<PatientUpdatePayload | null>(null);
  readonly notes = signal<PatientNote[]>([]);
  readonly isAdministrator: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly patientService: PatientService,
    accessControl: AccessControlService
  ) {
    this.isAdministrator = accessControl.isAdministrator();
  }

  /** Resolve o paciente da rota e carrega sua ficha e historico profissional. */
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
        this.loadHistory(patient.id);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nao foi possivel carregar a ficha do paciente.');
        this.loading.set(false);
      }
    });
  }

  /** Carrega o historico consolidado, incluindo o evento de abertura do prontuario. */
  private loadHistory(patientId: string): void {
    this.patientService.listNotes(patientId).subscribe({
      next: notes => this.notes.set(notes),
      error: () => this.error.set('Nao foi possivel carregar o historico.')
    });
  }

  /** Prepara apenas os campos permitidos e solicita confirmacao antes de atualizar. */
  update(payload: PatientIntakePayload): void {
    const patient = this.patient();
    if (!patient || !this.isAdministrator) return;

    const { cpf: _cpf, skinType: _skinType, consent: _consent, notes: _notes, ...editablePayload } = payload;
    this.pendingUpdate.set(editablePayload);
    this.confirmationModalOpen.set(true);
    this.error.set('');
    this.success.set('');
  }

  /** Confirma e envia ao backend as alteracoes preparadas pelo administrador. */
  confirmUpdate(): void {
    const patient = this.patient();
    const payload = this.pendingUpdate();
    if (!patient || !payload || !this.isAdministrator) {
      this.cancelUpdate();
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.patientService.updatePatient(patient.id, payload).subscribe({
      next: updated => {
        this.patient.set(updated);
        this.saving.set(false);
        this.cancelUpdate();
        this.success.set('Ficha atualizada com sucesso.');
      },
      error: error => {
        this.saving.set(false);
        this.error.set(error?.status === 403 ? 'Somente administradores podem alterar a ficha.' : 'Nao foi possivel atualizar a ficha.');
      }
    });
  }

  /** Descarta uma atualizacao ainda nao confirmada, preservando os dados atuais. */
  cancelUpdate(): void {
    if (this.saving()) return;
    this.confirmationModalOpen.set(false);
    this.pendingUpdate.set(null);
  }

  /** Remove os metadados da API para fornecer ao formulario somente os campos editaveis. */
  formValue(patient: Patient): PatientIntakePayload {
    const { id: _id, professionalNotes: _professionalNotes, createdAt: _createdAt, updatedAt: _updatedAt, ...payload } = patient;
    return payload;
  }

  /** Valida e adiciona uma nota profissional ao paciente carregado. */
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
