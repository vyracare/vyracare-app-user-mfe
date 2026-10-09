import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  VcButtonComponent,
  VcHeadingComponent,
  VcIconButtonComponent,
  VcInputComponent,
  VcSearchComponent,
  VcTextComponent,
  VcTextareaComponent,
  VcToastService,
  VcTooltipComponent
} from '@vyracare/design-system';
import { Patient, PatientNote } from '../../models/patient-intake.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'vyracare-patients-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    VcButtonComponent,
    VcHeadingComponent,
    VcIconButtonComponent,
    VcInputComponent,
    VcSearchComponent,
    VcTextComponent,
    VcTextareaComponent,
    VcTooltipComponent
  ],
  templateUrl: './patients-page.component.html',
  styleUrl: './patients-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/** Coordena a consulta de pacientes e os modais de notas e historico profissional. */
export class PatientsPageComponent implements OnInit {
  readonly patients = signal<Patient[]>([]);
  readonly notes = signal<PatientNote[]>([]);
  readonly selectedPatient = signal<Patient | null>(null);
  readonly loading = signal(true);
  readonly savingNote = signal(false);
  readonly error = signal('');
  readonly noteModalOpen = signal(false);
  readonly historyModalOpen = signal(false);
  readonly noteForm = new FormGroup({
    procedureName: new FormControl('', { nonNullable: true }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor(
    private readonly patientService: PatientService,
    private readonly toast: VcToastService
  ) {}

  /** Carrega a listagem inicial sem filtro textual. */
  ngOnInit(): void {
    this.search('');
  }

  /** Pesquisa pacientes por nome, telefone ou e-mail e atualiza a tabela. */
  search(value: string): void {
    this.loading.set(true);
    this.error.set('');
    this.patientService.listPatients(value).subscribe({
      next: patients => {
        this.patients.set(patients);
        this.loading.set(false);
      },
      error: () => {
        const message = 'Nao foi possivel carregar os pacientes.';
        this.error.set(message);
        this.toast.error('Falha ao carregar pacientes', message);
        this.loading.set(false);
      }
    });
  }

  /** Seleciona o paciente e abre o formulario de nota profissional. */
  openNote(patient: Patient): void {
    this.selectedPatient.set(patient);
    this.noteForm.reset();
    this.noteModalOpen.set(true);
  }

  /** Fecha o formulario de nota profissional. */
  closeNote(): void {
    this.noteModalOpen.set(false);
  }

  /** Valida e persiste uma nota vinculada ao paciente selecionado. */
  saveNote(): void {
    const patient = this.selectedPatient();
    if (!patient || this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      this.error.set('Informe a nota profissional.');
      return;
    }
    const { content, procedureName } = this.noteForm.getRawValue();
    this.savingNote.set(true);
    this.patientService.addNote(patient.id, {
      content: content.trim(),
      procedureName: procedureName.trim() || undefined
    }).subscribe({
      next: () => {
        this.savingNote.set(false);
        this.closeNote();
        this.toast.success('Nota adicionada', 'A nota profissional foi registrada no historico.');
      },
      error: () => {
        this.savingNote.set(false);
        const message = 'Nao foi possivel adicionar a nota.';
        this.error.set(message);
        this.toast.error('Falha ao adicionar nota', message);
      }
    });
  }

  /** Seleciona o paciente, abre o historico e carrega suas notas. */
  openHistory(patient: Patient): void {
    this.selectedPatient.set(patient);
    this.notes.set([]);
    this.historyModalOpen.set(true);
    this.patientService.listNotes(patient.id).subscribe({
      next: notes => this.notes.set(notes),
      error: () => {
        const message = 'Nao foi possivel carregar o historico.';
        this.error.set(message);
        this.toast.error('Falha ao carregar historico', message);
      }
    });
  }

  /** Fecha o historico profissional. */
  closeHistory(): void {
    this.historyModalOpen.set(false);
  }
}
