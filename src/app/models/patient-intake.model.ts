export interface PatientIntakePayload {
  fullName: string;
  birthDate: string;
  gender: string;
  cpf: string;
  email: string;
  phone: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement?: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  mainComplaint: string;
  objectives: string;
  medicalConditions?: string;
  allergies?: string;
  medications?: string;
  previousSurgeries?: string;
  aestheticProcedures?: string;
  skinType?: string;
  sunExposure?: string;
  smoking: boolean;
  alcohol: boolean;
  pregnantOrBreastfeeding: boolean;
  consent: boolean;
  notes?: string;
}

export interface PostalCodeAddress {
  postalCode: string;
  street: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Patient extends PatientIntakePayload {
  id: string;
  professionalNotes: PatientNote[];
  createdAt: string;
  updatedAt: string;
}

/** Dados que podem ser alterados por um administrador depois da abertura do prontuario. */
export type PatientUpdatePayload = Omit<PatientIntakePayload, 'cpf' | 'skinType' | 'consent' | 'notes'>;

export interface PatientNote {
  id: string;
  content: string;
  procedureName?: string;
  kind?: 'professional_note' | 'record_opened';
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface AddPatientNotePayload {
  content: string;
  procedureName?: string;
}
