import { TestBed } from '@angular/core/testing';
import { PatientIntakeFormComponent } from './patient-intake-form.component';
import { PatientIntakePayload } from '../../models/patient-intake.model';

describe('PatientIntakeFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientIntakeFormComponent]
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
      rg: '',
      email: '',
      phone: '',
      whatsapp: '',
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
});
