import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamListComponent } from './exams/exam-list/exam-list.component';
import { ExamDetailComponent } from './exams/exam-detail/exam-detail.component';
import { ExamItemComponent } from './exams/exam-list/exam-item/exam-item.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { AppRoutingModule } from './app-routing.module';
import { ExamStartComponent } from './exams/exam-start/exam-start.component';
import { ExamEditComponent } from './exams/exam-edit/exam-edit.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ExamsComponent,
    ExamListComponent,
    ExamDetailComponent,
    ExamItemComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    DropdownDirective,
    ExamStartComponent,
    ExamEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ShoppingListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
