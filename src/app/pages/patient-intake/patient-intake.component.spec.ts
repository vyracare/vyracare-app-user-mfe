import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { PatientIntakePageComponent } from './patient-intake.component';
import { PatientService } from '../../services/patient.service';
import { PatientIntakePayload } from '../../models/patient-intake.model';

describe('PatientIntakePageComponent', () => {
  let patientService: jest.Mocked<PatientService>;

  beforeEach(async () => {
    patientService = {
      registerPatient: jest.fn()
    } as jest.Mocked<PatientService>;

    await TestBed.configureTestingModule({
      imports: [PatientIntakePageComponent, RouterTestingModule],
      providers: [{ provide: PatientService, useValue: patientService }]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PatientIntakePageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should handle successful registration', () => {
    const fixture = TestBed.createComponent(PatientIntakePageComponent);
    const component = fixture.componentInstance;

    const payload: PatientIntakePayload = {
      fullName: 'Maria Silva',
      birthDate: '1992-04-18',
      gender: 'Feminino',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      email: 'maria@empresa.com',
      phone: '(11) 99999-9999',
      whatsapp: '(11) 98888-7777',
      addressStreet: 'Rua das Flores',
      addressNumber: '123',
      addressComplement: 'Sala 21',
      addressNeighborhood: 'Centro',
      addressCity: 'Sao Paulo',
      addressState: 'SP',
      addressZip: '01000-000',
      emergencyContactName: 'Ana Silva',
      emergencyContactPhone: '(11) 97777-6666',
      mainComplaint: 'Flacidez facial',
      objectives: 'Melhorar firmeza',
      medicalConditions: '',
      allergies: '',
      medications: '',
      previousSurgeries: '',
      aestheticProcedures: '',
      skinType: 'Mista',
      sunExposure: 'Moderada',
      smoking: false,
      alcohol: false,
      pregnantOrBreastfeeding: false,
      consent: true,
      notes: ''
    };

    patientService.registerPatient.mockReturnValue(of(void 0));

    component.handleSubmit(payload);

    expect(patientService.registerPatient).toHaveBeenCalledWith(payload);
    expect((component as any).loading()).toBe(false);
    expect((component as any).success()).toBe(true);
    expect((component as any).error()).toBeNull();
  });

  it('should handle failed registration', () => {
    const fixture = TestBed.createComponent(PatientIntakePageComponent);
    const component = fixture.componentInstance;

    const payload: PatientIntakePayload = {
      fullName: 'Maria Silva',
      birthDate: '1992-04-18',
      gender: 'Feminino',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      email: 'maria@empresa.com',
      phone: '(11) 99999-9999',
      whatsapp: '(11) 98888-7777',
      addressStreet: 'Rua das Flores',
      addressNumber: '123',
      addressComplement: 'Sala 21',
      addressNeighborhood: 'Centro',
      addressCity: 'Sao Paulo',
      addressState: 'SP',
      addressZip: '01000-000',
      emergencyContactName: 'Ana Silva',
      emergencyContactPhone: '(11) 97777-6666',
      mainComplaint: 'Flacidez facial',
      objectives: 'Melhorar firmeza',
      medicalConditions: '',
      allergies: '',
      medications: '',
      previousSurgeries: '',
      aestheticProcedures: '',
      skinType: 'Mista',
      sunExposure: 'Moderada',
      smoking: false,
      alcohol: false,
      pregnantOrBreastfeeding: false,
      consent: true,
      notes: ''
    };

    patientService.registerPatient.mockReturnValue(throwError(() => new Error('fail')));

    component.handleSubmit(payload);

    expect(patientService.registerPatient).toHaveBeenCalledWith(payload);
    expect((component as any).loading()).toBe(false);
    expect((component as any).success()).toBe(false);
    expect((component as any).error()).toBe('Falha ao salvar a ficha do paciente. Tente novamente.');
  });
});
