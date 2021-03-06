import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './start/start.component';
import { DeckComponent } from './deck/deck.component';
import { OptionsComponent } from './options/options.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateComponent } from './admin/create/create.component';
import { SearchComponent } from './admin/search/search.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'start', component: StartComponent},
  {path: 'options', component: OptionsComponent},
  {path: 'deck', component: DeckComponent},
  {path: 'admin/dashboard', component: DashboardComponent},
  {path: 'admin/create', component: CreateComponent},
  {path: 'admin/search', component: SearchComponent},
  {path: 'page-not-found', component: PageNotFoundComponent},
  {path: '', redirectTo: 'start', pathMatch: 'full'},
  {path: '**', redirectTo: 'page-not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
