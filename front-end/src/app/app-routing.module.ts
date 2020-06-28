import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './start/start.component';
import { DeckComponent } from './deck/deck.component';
import { OptionsComponent } from './options/options.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'start', component: StartComponent},
  {path: 'options', component: OptionsComponent},
  {path: 'deck', component: DeckComponent},
  {path: '', redirectTo: 'start', pathMatch: 'full'},
  {path: '**', redirectTo: 'start', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
