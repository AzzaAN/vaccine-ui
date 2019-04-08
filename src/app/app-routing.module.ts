import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { HospitalComponent } from './hospital/hospital.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PhysicianComponent } from './physician/physician.component';
import { FamilyComponent } from './family/family.component';
import { SchoolComponent } from './school/school.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: "", redirectTo:"login", pathMatch:"full"},
  {path:'login', component: LoginComponent, canActivate:[AuthGuard]},
  {path:'admin', component: AdminComponent},
  {path:'hospital', component: HospitalComponent},
  {path:'doctor', component: DoctorComponent},
  {path:'physician', component: PhysicianComponent},
  {path:'family', component: FamilyComponent},
  {path:'school', component: SchoolComponent},
  {path:'insurance', component: InsuranceComponent},
  {path: '**', redirectTo: '/login'}

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MatMomentDateModule
  ],
     exports: [ RouterModule ],

  declarations: []
})
export class AppRoutingModule { }