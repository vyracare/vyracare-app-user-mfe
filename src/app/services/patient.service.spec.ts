import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PatientService } from './patient.service';
import { environment } from '../../environments/environments';
import { PatientIntakePayload } from '../models/patient-intake.model';

describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatientService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register a patient via POST', () => {
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
      objectives: 'Melhorar firmeza e contorno',
      medicalConditions: 'Hipotireoidismo',
      allergies: 'Nenhuma',
      medications: 'Levotiroxina',
      previousSurgeries: 'Nenhuma',
      aestheticProcedures: 'Peeling 2023',
      skinType: 'Mista',
      sunExposure: 'Moderada',
      smoking: false,
      alcohol: true,
      pregnantOrBreastfeeding: false,
      consent: true,
      notes: 'Paciente prefere atendimentos pela tarde.'
    };

    service.registerPatient(payload).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(null);
  });
});
