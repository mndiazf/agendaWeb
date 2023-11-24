import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './UI/home/home.component';
import { MedicoComponent } from './UI/medico/medico.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'medico/:id', component: MedicoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
