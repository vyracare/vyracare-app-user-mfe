export interface PatientIntakePayload {
  fullName: string;
  birthDate: string;
  gender: string;
  cpf: string;
  rg?: string;
  email: string;
  phone: string;
  whatsapp?: string;
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

export interface Patient extends PatientIntakePayload {
  id: string;
  professionalNotes: PatientNote[];
  createdAt: string;
  updatedAt: string;
}

export interface PatientNote {
  id: string;
  content: string;
  procedureName?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface AddPatientNotePayload {
  content: string;
  procedureName?: string;
}
