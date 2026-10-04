import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  VcButtonComponent,
  VcCheckboxComponent,
  VcHeadingComponent,
  VcInputComponent,
  VcSelectComponent,
  VcTextComponent
} from '@vyracare/design-system';
import type { VcSelectOption } from '@vyracare/design-system';
import { PatientIntakePayload } from '../../models/patient-intake.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'vyracare-patient-intake-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VcButtonComponent,
    VcCheckboxComponent,
    VcHeadingComponent,
    VcInputComponent,
    VcSelectComponent,
    VcTextComponent
  ],
  templateUrl: './patient-intake-form.component.html',
  styleUrl: './patient-intake-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientIntakeFormComponent implements OnChanges {
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() initialValue: PatientIntakePayload | null = null;
  @Input() readOnly = false;
  @Input() submitLabel = 'Salvar ficha';
  @Output() formSubmit = new EventEmitter<PatientIntakePayload>();
  readonly postalCodeLoading = signal(false);
  readonly postalCodeFeedback = signal('');
  readonly postalCodeError = signal('');
  readonly addressFieldsEnabled = signal(false);

  private readonly addressFieldNames = [
    'addressStreet',
    'addressNumber',
    'addressComplement',
    'addressNeighborhood',
    'addressCity',
    'addressState'
  ] as const;
  private resolvedPostalCode = '';

  readonly genders = ['Feminino', 'Masculino', 'Nao-binario', 'Prefiro nao informar'];
  readonly skinTypes = ['Normal', 'Seca', 'Oleosa', 'Mista', 'Sensivel'];
  readonly sunExposureLevels = ['Baixa', 'Moderada', 'Alta'];
  readonly states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
  readonly genderOptions: VcSelectOption[] = this.genders.map((gender) => ({ label: gender, value: gender }));
  readonly skinTypeOptions: VcSelectOption[] = this.skinTypes.map((type) => ({ label: type, value: type }));
  readonly sunExposureOptions: VcSelectOption[] = this.sunExposureLevels.map((level) => ({
    label: level,
    value: level
  }));
  readonly stateOptions: VcSelectOption[] = this.states.map((state) => ({ label: state, value: state }));

  readonly form: FormGroup<{
    fullName: FormControl<string>;
    birthDate: FormControl<string>;
    gender: FormControl<string>;
    cpf: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
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

  constructor(private readonly fb: NonNullableFormBuilder, private readonly patientService: PatientService) {
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
        validators: [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]
      }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email]
      }),
      phone: this.fb.control('', {
        validators: [Validators.required]
      }),
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
        validators: [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]
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
    this.setAddressFieldsEnabled(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && this.initialValue) {
      this.form.patchValue(this.initialValue);
      this.resolvedPostalCode = this.normalizePostalCode(this.initialValue.addressZip);
      this.addressFieldsEnabled.set(this.hasInitialAddress(this.initialValue));
    }

    if (changes['initialValue'] || changes['readOnly']) {
      this.applyFormAccessState();
    }
  }

  onSubmit() {
    if (!this.addressFieldsEnabled() || this.form.invalid) {
      this.form.markAllAsTouched();
      if (!this.addressFieldsEnabled()) {
        this.form.controls.addressZip.markAsTouched();
        this.postalCodeError.set('Consulte um CEP valido para liberar o endereco.');
      }
      return;
    }

    this.formSubmit.emit(this.form.getRawValue());
  }

  lookupPostalCode(postalCode: string): void {
    if (this.readOnly) return;
    const normalized = this.normalizePostalCode(postalCode);
    this.postalCodeFeedback.set('');
    this.postalCodeError.set('');
    if (normalized.length !== 8) {
      this.clearAddressFields();
      this.resolvedPostalCode = '';
      this.setAddressFieldsEnabled(false);
      this.form.controls.addressZip.markAsTouched();
      return;
    }

    if (normalized !== this.resolvedPostalCode) {
      this.clearAddressFields();
    }
    this.setAddressFieldsEnabled(false);
    this.postalCodeLoading.set(true);
    this.patientService.getAddressByPostalCode(normalized).subscribe({
      next: address => {
        this.form.patchValue({
          addressStreet: address.street,
          addressNeighborhood: address.neighborhood,
          addressCity: address.city,
          addressState: address.state,
          addressComplement: this.form.controls.addressComplement.value || address.complement || ''
        });
        this.resolvedPostalCode = normalized;
        this.setAddressFieldsEnabled(true);
        this.postalCodeLoading.set(false);
        this.postalCodeFeedback.set('Endereco localizado pelos Correios.');
      },
      error: error => {
        this.resolvedPostalCode = '';
        this.setAddressFieldsEnabled(false);
        this.postalCodeLoading.set(false);
        this.postalCodeError.set(error?.status === 404 ? 'CEP nao encontrado.' : 'Nao foi possivel consultar o CEP agora.');
      }
    });
  }

  resetForm() {
    if (this.initialValue) {
      this.form.reset(this.initialValue);
      this.resolvedPostalCode = this.normalizePostalCode(this.initialValue.addressZip);
      this.addressFieldsEnabled.set(this.hasInitialAddress(this.initialValue));
      this.applyFormAccessState();
      return;
    }
    this.form.reset({
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
    this.resolvedPostalCode = '';
    this.addressFieldsEnabled.set(false);
    this.postalCodeFeedback.set('');
    this.postalCodeError.set('');
    this.applyFormAccessState();
  }

  private applyFormAccessState(): void {
    if (this.readOnly) {
      this.form.disable({ emitEvent: false });
      return;
    }

    this.form.enable({ emitEvent: false });
    this.setAddressFieldsEnabled(this.addressFieldsEnabled());
  }

  private setAddressFieldsEnabled(enabled: boolean): void {
    this.addressFieldsEnabled.set(enabled);
    for (const fieldName of this.addressFieldNames) {
      const control = this.form.controls[fieldName];
      enabled ? control.enable({ emitEvent: false }) : control.disable({ emitEvent: false });
    }
  }

  private clearAddressFields(): void {
    this.form.patchValue({
      addressStreet: '',
      addressNumber: '',
      addressComplement: '',
      addressNeighborhood: '',
      addressCity: '',
      addressState: ''
    }, { emitEvent: false });
  }

  private normalizePostalCode(postalCode: string | null | undefined): string {
    return (postalCode ?? '').replace(/\D/g, '');
  }

  private hasInitialAddress(value: PatientIntakePayload): boolean {
    return this.normalizePostalCode(value.addressZip).length === 8
      && Boolean(value.addressStreet && value.addressNeighborhood && value.addressCity && value.addressState);
  }
}
