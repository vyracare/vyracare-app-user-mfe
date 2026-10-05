import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Patient } from '../../models/patient-intake.model';
import { PatientService } from '../../services/patient.service';
import { PatientsPageComponent } from './patients-page.component';

describe('PatientsPageComponent', () => {
  const patient = {
    id: 'patient-1', fullName: 'Maria Silva', cpf: '123', phone: '11999999999', email: 'maria@teste.com',
    updatedAt: '2026-10-03T12:00:00Z', professionalNotes: []
  } as Patient;
  const service = {
    listPatients: jest.fn(), addNote: jest.fn(), listNotes: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    service.listPatients.mockReturnValue(of([patient]));
    service.addNote.mockReturnValue(of({ id: 'note-1' }));
    service.listNotes.mockReturnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [PatientsPageComponent],
      providers: [provideRouter([]), { provide: PatientService, useValue: service }]
    }).compileComponents();
  });

  it('should load and search patients', () => {
    const fixture = TestBed.createComponent(PatientsPageComponent);
    fixture.detectChanges();
    expect(service.listPatients).toHaveBeenCalledWith('');
    fixture.componentInstance.search('Maria');
    expect(service.listPatients).toHaveBeenLastCalledWith('Maria');
    expect(fixture.componentInstance.patients()).toEqual([patient]);
    expect(fixture.nativeElement.querySelector('.page-header .header-tag')).toBeNull();
    expect(fixture.nativeElement.querySelector('.table-toolbar .primary-action')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.actions vc-icon-button')).toHaveLength(3);
    expect(fixture.nativeElement.querySelectorAll('.actions vc-tooltip')).toHaveLength(3);
  });

  it('should add a professional note', () => {
    const component = TestBed.createComponent(PatientsPageComponent).componentInstance;
    component.openNote(patient);
    component.saveNote('Boa evolucao', 'Peeling');
    expect(service.addNote).toHaveBeenCalledWith('patient-1', { content: 'Boa evolucao', procedureName: 'Peeling' });
    expect(component.noteModalOpen()).toBe(false);
    component.closeNote();
  });

  it('should validate and handle note errors', () => {
    const component = TestBed.createComponent(PatientsPageComponent).componentInstance;
    component.saveNote('', '');
    expect(component.error()).toContain('Informe');
    component.openNote(patient);
    service.addNote.mockReturnValue(throwError(() => new Error('fail')));
    component.saveNote('Nota', '');
    expect(component.error()).toContain('adicionar');
  });

  it('should show note history and handle errors', () => {
    const component = TestBed.createComponent(PatientsPageComponent).componentInstance;
    service.listNotes.mockReturnValue(of([{
      id: 'record-opened-patient-1',
      content: 'Prontuário aberto com o cadastro inicial do paciente.',
      procedureName: 'Abertura do prontuário',
      kind: 'record_opened',
      authorId: 'system',
      authorName: 'Sistema Vyracare',
      createdAt: patient.updatedAt
    }]));
    component.openHistory(patient);
    expect(service.listNotes).toHaveBeenCalledWith('patient-1');
    expect(component.notes()[0].kind).toBe('record_opened');
    component.closeHistory();
    expect(component.historyModalOpen()).toBe(false);
    service.listNotes.mockReturnValue(throwError(() => new Error('fail')));
    component.openHistory(patient);
    expect(component.error()).toContain('historico');
  });

  it('should handle patient loading errors', () => {
    service.listPatients.mockReturnValue(throwError(() => new Error('fail')));
    const component = TestBed.createComponent(PatientsPageComponent).componentInstance;
    component.search('x');
    expect(component.loading()).toBe(false);
    expect(component.error()).toContain('carregar');
  });
});
