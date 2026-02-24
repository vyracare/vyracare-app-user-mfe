import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientIntakePayload } from '../../models/patient-intake.model';

@Component({
  selector: 'vyracare-patient-intake-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-intake-form.component.html',
  styleUrl: './patient-intake-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientIntakeFormComponent {
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() formSubmit = new EventEmitter<PatientIntakePayload>();

  readonly genders = ['Feminino', 'Masculino', 'Nao-binario', 'Prefiro nao informar'];
  readonly skinTypes = ['Normal', 'Seca', 'Oleosa', 'Mista', 'Sensivel'];
  readonly sunExposureLevels = ['Baixa', 'Moderada', 'Alta'];
  readonly states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  readonly form: FormGroup<{
    fullName: FormControl<string>;
    birthDate: FormControl<string>;
    gender: FormControl<string>;
    cpf: FormControl<string>;
    rg: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
    whatsapp: FormControl<string>;
    addressStreet: FormControl<string>;
    addressNumber: FormControl<string>;
    addressComplement: FormControl<string>;
    addressNeighborhood: FormControl<string>;
    addressCity: FormControl<string>;
    addressState: FormControl<string>;
    addressZip: FormControl<string>;
    emergencyContactName: FormControl<string>;
    emergencyContactPhone: FormControl<string>;
    mainComplaint: FormControl<string>;
    objectives: FormControl<string>;
    medicalConditions: FormControl<string>;
    allergies: FormControl<string>;
    medications: FormControl<string>;
    previousSurgeries: FormControl<string>;
    aestheticProcedures: FormControl<string>;
    skinType: FormControl<string>;
    sunExposure: FormControl<string>;
    smoking: FormControl<boolean>;
    alcohol: FormControl<boolean>;
    pregnantOrBreastfeeding: FormControl<boolean>;
    consent: FormControl<boolean>;
    notes: FormControl<string>;
  }>;

  constructor(private readonly fb: NonNullableFormBuilder) {
    this.form = this.fb.group({
      fullName: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      birthDate: this.fb.control('', {
        validators: [Validators.required]
      }),
      gender: this.fb.control('', {
        validators: [Validators.required]
      }),
      cpf: this.fb.control('', {
        validators: [Validators.required]
      }),
      rg: this.fb.control(''),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email]
      }),
      phone: this.fb.control('', {
        validators: [Validators.required]
      }),
      whatsapp: this.fb.control(''),
      addressStreet: this.fb.control('', {
        validators: [Validators.required]
      }),
      addressNumber: this.fb.control('', {
        validators: [Validators.required]
      }),
      addressComplement: this.fb.control(''),
      addressNeighborhood: this.fb.control('', {
        validators: [Validators.required]
      }),
      addressCity: this.fb.control('', {
        validators: [Validators.required]
      }),
      addressState: this.fb.control('', {
        validators: [Validators.required]
      }),
      addressZip: this.fb.control('', {
        validators: [Validators.required]
      }),
      emergencyContactName: this.fb.control('', {
        validators: [Validators.required]
      }),
      emergencyContactPhone: this.fb.control('', {
        validators: [Validators.required]
      }),
      mainComplaint: this.fb.control('', {
        validators: [Validators.required]
      }),
      objectives: this.fb.control('', {
        validators: [Validators.required]
      }),
      medicalConditions: this.fb.control(''),
      allergies: this.fb.control(''),
      medications: this.fb.control(''),
      previousSurgeries: this.fb.control(''),
      aestheticProcedures: this.fb.control(''),
      skinType: this.fb.control(''),
      sunExposure: this.fb.control(''),
      smoking: this.fb.control(false),
      alcohol: this.fb.control(false),
      pregnantOrBreastfeeding: this.fb.control(false),
      consent: this.fb.control(false, {
        validators: [Validators.requiredTrue]
      }),
      notes: this.fb.control('')
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.form.getRawValue());
  }

  resetForm() {
    this.form.reset({
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
  }
}
