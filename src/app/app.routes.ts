import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';
import { AlumnoDetailComponent } from './pages/alumnos/alumno-detail/alumno-detail.component';
import { AlumnoFormComponent } from './pages/alumnos/alumno-form/alumno-form.component';
import { AlumnoListComponent } from  './pages/alumnos/alumno-list/alumno-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login - Sistema de Predicción' },
  { path: 'home', component: HomeComponent, title: 'Home - Sistema de Predicción' },
  { path: 'reporte', component: ReporteComponent, title: 'Reporte de riesgo de abandono' },
  {
    path: 'alumnos',
    component: AlumnosComponent, title:'Teschi - Alumnos',
    children: [
      { path: '', component: AlumnoListComponent }, // listado por defecto
      { path: 'nuevo', component: AlumnoFormComponent },
      { path: ':id', component: AlumnoDetailComponent },
      { path: ':id/editar', component: AlumnoFormComponent },
    ]
  },
];
