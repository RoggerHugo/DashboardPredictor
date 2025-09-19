import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';
import { AlumnoDetailComponent } from './pages/alumnos/alumno-detail/alumno-detail.component';
import { AlumnoFormComponent } from './pages/alumnos/alumno-form/alumno-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'reporte', component: ReporteComponent },
  {
    path: 'alumnos',
    component: AlumnosComponent,
    children: [
      { path: 'nuevo', component: AlumnoFormComponent },
      { path: ':id', component: AlumnoDetailComponent },
      { path: ':id/editar', component: AlumnoFormComponent },
    ]
  },
];
