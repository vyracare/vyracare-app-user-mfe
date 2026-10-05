import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Patient, PatientIntakePayload } from '../../models/patient-intake.model';
import { AccessControlService } from '../../services/access-control.service';
import { PatientService } from '../../services/patient.service';
import { PatientEditPageComponent } from './patient-edit-page.component';

describe('PatientEditPageComponent', () => {
  const patient = {
    id: 'patient-1', fullName: 'Maria Silva', cpf: '123', email: 'maria@teste.com', phone: '1199',
    professionalNotes: [], createdAt: '2026-10-01T12:00:00Z', updatedAt: '2026-10-03T12:00:00Z'
  } as Patient;
  const service = {
    getPatient: jest.fn(), updatePatient: jest.fn(), addNote: jest.fn(), listNotes: jest.fn()
  };
  const access = { isAdministrator: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    service.getPatient.mockReturnValue(of(patient));
    service.updatePatient.mockReturnValue(of(patient));
    service.addNote.mockReturnValue(of({ id: 'note-1', content: 'Nota', authorName: 'Ana', createdAt: '2026-10-03T12:00:00Z' }));
    service.listNotes.mockReturnValue(of([{
      id: 'record-opened-patient-1',
      content: 'Prontuário aberto com o cadastro inicial do paciente.',
      procedureName: 'Abertura do prontuário',
      kind: 'record_opened',
      authorId: 'system',
      authorName: 'Sistema Vyracare',
      createdAt: patient.createdAt
    }]));
    access.isAdministrator.mockReturnValue(true);
    await TestBed.configureTestingModule({
      imports: [PatientEditPageComponent],
      providers: [
        provideRouter([]),
        { provide: PatientService, useValue: service },
        { provide: AccessControlService, useValue: access },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'patient-1' }) } } }
      ]
    }).compileComponents();
  });

  it('should load and update the patient as administrator', () => {
    const fixture = TestBed.createComponent(PatientEditPageComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.patient()).toEqual(patient);
    expect(service.listNotes).toHaveBeenCalledWith('patient-1');
    expect(component.notes()[0].kind).toBe('record_opened');
    const payload = component.formValue(patient);
    expect((payload as PatientIntakePayload).fullName).toBe('Maria Silva');
    expect((payload as any).id).toBeUndefined();
    component.update(payload);
    expect(service.updatePatient).toHaveBeenCalledWith('patient-1', payload);
    expect(component.success()).toContain('sucesso');
    expect(fixture.nativeElement.querySelector('.page-header .header-tag')).toBeNull();
    expect(fixture.nativeElement.querySelector('.page-actions')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.breadcrumb').textContent).toContain('Prontuário do paciente');
  });

  it('should not update the full record without administrator access', () => {
    access.isAdministrator.mockReturnValue(false);
    const component = TestBed.createComponent(PatientEditPageComponent).componentInstance;
    component.ngOnInit();
    component.update({} as PatientIntakePayload);
    expect(service.updatePatient).not.toHaveBeenCalled();
  });

  it('should add notes and validate empty content', () => {
    const component = TestBed.createComponent(PatientEditPageComponent).componentInstance;
    component.ngOnInit();
    component.saveNote('', '');
    expect(component.error()).toContain('Informe');
    component.saveNote('Nota', 'Peeling');
    expect(service.addNote).toHaveBeenCalled();
    expect(component.notes()).toHaveLength(2);
  });

  it('should handle load, update and note errors', () => {
    service.getPatient.mockReturnValue(throwError(() => new Error('fail')));
    const component = TestBed.createComponent(PatientEditPageComponent).componentInstance;
    component.ngOnInit();
    expect(component.error()).toContain('carregar');

    component.patient.set(patient);
    service.updatePatient.mockReturnValue(throwError(() => ({ status: 403 })));
    component.update({} as PatientIntakePayload);
    expect(component.error()).toContain('administradores');

    service.addNote.mockReturnValue(throwError(() => new Error('fail')));
    component.saveNote('Nota', '');
    expect(component.error()).toContain('adicionar');
  });

  it('should handle history loading errors', () => {
    service.listNotes.mockReturnValue(throwError(() => new Error('fail')));
    const component = TestBed.createComponent(PatientEditPageComponent).componentInstance;
    component.ngOnInit();
    expect(component.error()).toContain('historico');
  });
});
