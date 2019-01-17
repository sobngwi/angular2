import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Recipe } from '../exam.model';
import { ExamService } from '../exam.service';
import {Chapter} from '../../shared/chapter';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit {
  constructor(private examService: ExamService,
              private router: Router,
              private route: ActivatedRoute) { }

  recipes: Recipe[];
  private  chapters: Array<Chapter> = new Array<Chapter>();

  ngOnInit() {
    this.recipes = this.examService.getRecipes();
    this.examService.synchronousGetDatasFromBackEnd('http://localhost:8080/question/search/subjects/all').forEach(
      (value) => {
        this.recipes.push(
          new Recipe(value.chapitre, value.subject,
            'https://upload.wikimedia.org/wikipedia/commons/8/8d/Design_pattern_fabrique.png',
            []));
      });
    this.examService.setRecipes(this.recipes);
  }
  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
