import { Routes } from '@angular/router';
import { PatientIntakePageComponent } from './pages/patient-intake/patient-intake.component';
import { PatientsPageComponent } from './pages/patients/patients-page.component';
import { PatientEditPageComponent } from './pages/patient-edit/patient-edit-page.component';

export const routes: Routes = [
  { path: '', component: PatientsPageComponent },
  { path: 'cadastro', component: PatientIntakePageComponent },
  { path: 'editar/:id', component: PatientEditPageComponent }
];

export const ROUTES: Routes = routes;
