import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamsComponent } from './exams/exams.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ExamStartComponent } from './exams/exam-start/exam-start.component';
import { ExamDetailComponent } from './exams/exam-detail/exam-detail.component';
import { ExamEditComponent } from './exams/exam-edit/exam-edit.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/exams', pathMatch: 'full' },
  { path: 'exams', component: ExamsComponent, children: [
    { path: '', component: ExamStartComponent },
    { path: 'new', component: ExamEditComponent },
    { path: ':id', component: ExamDetailComponent },
    { path: ':id/edit', component: ExamEditComponent },
  ] },
  { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
