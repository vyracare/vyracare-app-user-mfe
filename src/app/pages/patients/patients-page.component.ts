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

  ngOnInit(): void {
    this.search('');
  }

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

  openNote(patient: Patient): void {
    this.selectedPatient.set(patient);
    this.noteModalOpen.set(true);
  }

  closeNote(): void {
    this.noteModalOpen.set(false);
  }

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

  openHistory(patient: Patient): void {
    this.selectedPatient.set(patient);
    this.notes.set([]);
    this.historyModalOpen.set(true);
    this.patientService.listNotes(patient.id).subscribe({
      next: notes => this.notes.set(notes),
      error: () => this.error.set('Nao foi possivel carregar o historico.')
    });
  }

  closeHistory(): void {
    this.historyModalOpen.set(false);
  }
}
