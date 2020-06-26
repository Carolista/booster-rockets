import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './start/start.component';
import { DeckComponent } from './deck/deck.component';
import { OptionsComponent } from './options/options.component';

const routes: Routes = [
  {path: 'start', component: StartComponent},
  {path: 'deck', component: DeckComponent},
  {path: 'options', component: OptionsComponent},
  {path: '', redirectTo: 'start', pathMatch: 'full'},
  {path: '**', redirectTo: 'start', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
