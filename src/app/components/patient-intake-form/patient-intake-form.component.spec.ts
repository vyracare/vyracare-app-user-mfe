import { TestBed } from '@angular/core/testing';
import { PatientIntakeFormComponent } from './patient-intake-form.component';
import { PatientIntakePayload } from '../../models/patient-intake.model';
import { of, throwError } from 'rxjs';
import { PatientService } from '../../services/patient.service';

describe('PatientIntakeFormComponent', () => {
  const patientService = { getAddressByPostalCode: jest.fn() };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientIntakeFormComponent],
      providers: [{ provide: PatientService, useValue: patientService }]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PatientIntakeFormComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should emit payload when form is valid', () => {
    const fixture = TestBed.createComponent(PatientIntakeFormComponent);
    const component = fixture.componentInstance;

    const formValue = {
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

    component.form.setValue(formValue);

    const emitSpy = jest.spyOn(component.formSubmit, 'emit');
    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith(formValue as PatientIntakePayload);
  });

  it('should mark controls as touched when form is invalid', () => {
    const fixture = TestBed.createComponent(PatientIntakeFormComponent);
    const component = fixture.componentInstance;

    const emitSpy = jest.spyOn(component.formSubmit, 'emit');
    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.form.controls.fullName.touched).toBe(true);
    expect(component.form.controls.email.touched).toBe(true);
  });

  it('should reset the form to defaults', () => {
    const fixture = TestBed.createComponent(PatientIntakeFormComponent);
    const component = fixture.componentInstance;

    component.form.setValue({
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
      smoking: true,
      alcohol: false,
      pregnantOrBreastfeeding: false,
      consent: true,
      notes: ''
    });

    component.resetForm();

    expect(component.form.getRawValue()).toEqual({
      fullName: '',
      birthDate: '',
      gender: '',
      cpf: '',
      email: '',
      phone: '',
      addressStreet: '',
      addressNumber: '',
      addressComplement: '',
      addressNeighborhood: '',
      addressCity: '',
      addressState: '',
      addressZip: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      mainComplaint: '',
      objectives: '',
      medicalConditions: '',
      allergies: '',
      medications: '',
      previousSurgeries: '',
      aestheticProcedures: '',
      skinType: '',
      sunExposure: '',
      smoking: false,
      alcohol: false,
      pregnantOrBreastfeeding: false,
      consent: false,
      notes: ''
    });
  });

  it('should fill address after postal code lookup', () => {
    patientService.getAddressByPostalCode.mockReturnValue(of({
      postalCode: '01001001', street: 'Praca da Se', neighborhood: 'Se', city: 'Sao Paulo', state: 'SP'
    }));
    const component = TestBed.createComponent(PatientIntakeFormComponent).componentInstance;
    component.lookupPostalCode('01001-001');
    expect(patientService.getAddressByPostalCode).toHaveBeenCalledWith('01001001');
    expect(component.form.controls.addressStreet.value).toBe('Praca da Se');
    expect(component.postalCodeFeedback()).toContain('Correios');
  });

  it('should validate and handle postal code errors', () => {
    const component = TestBed.createComponent(PatientIntakeFormComponent).componentInstance;
    component.lookupPostalCode('123');
    expect(component.form.controls.addressZip.touched).toBe(true);
    patientService.getAddressByPostalCode.mockReturnValue(throwError(() => ({ status: 404 })));
    component.lookupPostalCode('01001-001');
    expect(component.postalCodeError()).toBe('CEP nao encontrado.');
  });

  it('should apply initial values, restore them and control read-only mode', () => {
    const component = TestBed.createComponent(PatientIntakeFormComponent).componentInstance;
    const initial = { ...component.form.getRawValue(), fullName: 'Maria Silva', cpf: '123' };
    component.initialValue = initial;
    component.readOnly = true;
    component.ngOnChanges({ initialValue: {} as any, readOnly: {} as any });
    expect(component.form.getRawValue().fullName).toBe('Maria Silva');
    expect(component.form.disabled).toBe(true);

    component.readOnly = false;
    component.ngOnChanges({ readOnly: {} as any });
    expect(component.form.enabled).toBe(true);
    component.form.patchValue({ fullName: 'Alterado' });
    component.resetForm();
    expect(component.form.getRawValue().fullName).toBe('Maria Silva');
  });
});
