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

    const req = httpMock.expectOne(`${environment.clientApiUrl}/patients`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(null);
  });

  it('should list and search patients', () => {
    service.listPatients('Maria').subscribe();
    const req = httpMock.expectOne(request => request.url === `${environment.clientApiUrl}/patients` && request.params.get('search') === 'Maria');
    expect(req.request.method).toBe('GET');
    req.flush([]);

    service.listPatients().subscribe();
    const all = httpMock.expectOne(`${environment.clientApiUrl}/patients`);
    expect(all.request.params.has('search')).toBe(false);
    all.flush([]);
  });

  it('should get and update a patient', () => {
    const payload = { fullName: 'Maria' } as PatientIntakePayload;
    service.getPatient('patient-1').subscribe();
    httpMock.expectOne(`${environment.clientApiUrl}/patients/patient-1`).flush({});

    service.updatePatient('patient-1', payload).subscribe();
    const update = httpMock.expectOne(`${environment.clientApiUrl}/patients/patient-1`);
    expect(update.request.method).toBe('PUT');
    expect(update.request.body).toEqual(payload);
    update.flush({});
  });

  it('should add and list professional notes', () => {
    service.addNote('patient-1', { content: 'Evolucao', procedureName: 'Peeling' }).subscribe();
    const create = httpMock.expectOne(`${environment.clientApiUrl}/patients/patient-1/notes`);
    expect(create.request.method).toBe('POST');
    create.flush({});

    service.listNotes('patient-1').subscribe();
    const list = httpMock.expectOne(`${environment.clientApiUrl}/patients/patient-1/notes`);
    expect(list.request.method).toBe('GET');
    list.flush([]);
  });
});
