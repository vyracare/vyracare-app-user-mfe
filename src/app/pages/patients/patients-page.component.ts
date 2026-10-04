import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VcButtonComponent, VcHeadingComponent, VcTextComponent } from '@vyracare/design-system';
import { Patient, PatientNote } from '../../models/patient-intake.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'vyracare-patients-page',
  standalone: true,
  imports: [CommonModule, RouterLink, VcButtonComponent, VcHeadingComponent, VcTextComponent],
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

  constructor(private readonly patientService: PatientService) {}

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
        this.error.set('Nao foi possivel carregar os pacientes.');
        this.loading.set(false);
      }
    });
  }

  /** Seleciona o paciente e abre o formulario de nota profissional. */
  openNote(patient: Patient): void {
    this.selectedPatient.set(patient);
    this.noteModalOpen.set(true);
  }

  /** Fecha o formulario de nota profissional. */
  closeNote(): void {
    this.noteModalOpen.set(false);
  }

  /** Valida e persiste uma nota vinculada ao paciente selecionado. */
  saveNote(content: string, procedureName: string): void {
    const patient = this.selectedPatient();
    if (!patient || !content.trim()) {
      this.error.set('Informe a nota profissional.');
      return;
    }
    this.savingNote.set(true);
    this.patientService.addNote(patient.id, {
      content: content.trim(),
      procedureName: procedureName.trim() || undefined
    }).subscribe({
      next: () => {
        this.savingNote.set(false);
        this.closeNote();
      },
      error: () => {
        this.savingNote.set(false);
        this.error.set('Nao foi possivel adicionar a nota.');
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
      error: () => this.error.set('Nao foi possivel carregar o historico.')
    });
  }

  /** Fecha o historico profissional. */
  closeHistory(): void {
    this.historyModalOpen.set(false);
  }
}
