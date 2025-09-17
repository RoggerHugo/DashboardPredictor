import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ReporteComponent } from './pages/reporte/reporte.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'reporte', component: ReporteComponent },
  { path: '**', redirectTo: 'login' },
];
