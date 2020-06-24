import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './start/start.component';
import { Flashcard } from './flashcard';

const routes: Routes = [
  {path: 'start', component: StartComponent},
  {path: 'flashcard', component: Flashcard},
  {path: '', redirectTo: 'start', pathMatch: 'full'},
  {path: '**', redirectTo: 'start', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
