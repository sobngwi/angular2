import { Component, OnInit } from '@angular/core';
import { Recipe } from './exam.model';
import {Qu,ExamService} from './exam.service';



@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css'],
  providers: [ExamService]
})
export class ExamsComponent implements OnInit {
  selectedRecipe: Recipe;
  constructor(private examService: ExamService) { }

  ngOnInit() {
    this.examService.recipeSelected
      .subscribe(
        (recipe: Recipe) => {
          this.selectedRecipe = recipe;
        }
      );
  }
}
