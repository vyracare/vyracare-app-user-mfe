import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { AddPatientNotePayload, Patient, PatientIntakePayload, PatientNote } from '../models/patient-intake.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly apiUrl = environment.clientApiUrl;

  constructor(private readonly http: HttpClient) {}

  registerPatient(payload: PatientIntakePayload): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/patients`, payload);
  }

  listPatients(search = ''): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/patients`, {
      params: search.trim() ? { search: search.trim() } : {}
    });
  }

  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patients/${id}`);
  }

  updatePatient(id: string, payload: PatientIntakePayload): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/patients/${id}`, payload);
  }

  addNote(patientId: string, payload: AddPatientNotePayload): Observable<PatientNote> {
    return this.http.post<PatientNote>(`${this.apiUrl}/patients/${patientId}/notes`, payload);
  }

  listNotes(patientId: string): Observable<PatientNote[]> {
    return this.http.get<PatientNote[]>(`${this.apiUrl}/patients/${patientId}/notes`);
  }
}
