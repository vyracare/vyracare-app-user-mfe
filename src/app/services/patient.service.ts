import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { PatientIntakePayload } from '../models/patient-intake.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  registerPatient(payload: PatientIntakePayload): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, payload);
  }
}
