import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { VcToastService } from '@vyracare/design-system';
import { of, throwError } from 'rxjs';
import { PatientIntakePageComponent } from './patient-intake.component';
import { PatientService } from '../../services/patient.service';
import { PatientIntakePayload } from '../../models/patient-intake.model';

describe('PatientIntakePageComponent', () => {
  let patientService: jest.Mocked<PatientService>;
  const toast = { success: jest.fn(), error: jest.fn() };

  beforeEach(async () => {
    patientService = {
      registerPatient: jest.fn()
    } as jest.Mocked<PatientService>;

    await TestBed.configureTestingModule({
      imports: [PatientIntakePageComponent, RouterTestingModule],
      providers: [
        { provide: PatientService, useValue: patientService },
        { provide: VcToastService, useValue: toast }
      ]
    }).compileComponents();
    jest.clearAllMocks();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PatientIntakePageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should show success feedback and return to patients after registration', () => {
    const fixture = TestBed.createComponent(PatientIntakePageComponent);
    const component = fixture.componentInstance;

    const payload: PatientIntakePayload = {
      fullName: 'Maria Silva',
      birthDate: '1992-04-18',
      gender: 'Feminino',
      cpf: '123.456.789-00',
      email: 'maria@empresa.com',
      phone: '(11) 99999-9999',
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
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.handleSubmit(payload);

    expect(patientService.registerPatient).toHaveBeenCalledWith(payload);
    expect((component as any).loading()).toBe(false);
    expect(toast.success).toHaveBeenCalledWith('Paciente cadastrado', 'A ficha foi salva com sucesso.');
    expect(navigateSpy).toHaveBeenCalledWith(['/pacientes']);
  });

  it('should handle failed registration', () => {
    const fixture = TestBed.createComponent(PatientIntakePageComponent);
    const component = fixture.componentInstance;

    const payload: PatientIntakePayload = {
      fullName: 'Maria Silva',
      birthDate: '1992-04-18',
      gender: 'Feminino',
      cpf: '123.456.789-00',
      email: 'maria@empresa.com',
      phone: '(11) 99999-9999',
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

    patientService.registerPatient.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 409 })));

    component.handleSubmit(payload);

    expect(patientService.registerPatient).toHaveBeenCalledWith(payload);
    expect((component as any).loading()).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      'Nao foi possivel cadastrar o paciente',
      'Ja existe um paciente cadastrado com este CPF.'
    );
  });
});
