import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ExamService} from '../exam.service';
import {Subscription} from 'rxjs';
import {HttpService} from '../../shared/http.service';
import {QuestionModel} from '../../shared/question.model';

@Component({
  selector: 'app-exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.css'],
  providers: [HttpService]
})
export class ExamEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private questions: Array<QuestionModel> = new Array<QuestionModel>();
  private currentPositionInQuestions = 0;
  private subscriptionParams: Subscription;

  constructor(private route: ActivatedRoute,
              private examService: ExamService,
              private httpService: HttpService,
              private router: Router) {
  }

    ngOnInit() {
      /* this.httpService.simpleGet('http://localhost:8080/question/search/chapter/1').subscribe(
        (chap1: Array<QuestionModel>) => {
          console.log(chap1);
        }
      ); */
    this.subscriptionParams = this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
           this.httpService
            .executeSynchronousRequest('http://localhost:8080/question/search/chapter/' + this.examService.getRecipe(this.id).name).
           forEach(
            value => {
              this.questions.push({
                id: value.id,
                chapitre: value.chapitre,
                choices: value.choices,
                exam: value.exam,
                javaCode: value.javaCode,
                subject: value.subject,
                text: value.text,
                type: value.type
              });
            }
          );
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }
  ngOnDestroy(): void {
    this.subscriptionParams.unsubscribe();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onSubmit() {
    if (this.editMode) {
      this.examService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.examService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  private initForm() {
    let recipeIngredients = new FormArray([]);
    if (this.editMode) {
      const recipe = this.examService.getRecipe(this.id);
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      'idQuestion': new FormControl( this.questions[this.currentPositionInQuestions].id,
        Validators.required),
      'questionText': new FormControl(this.questions[this.currentPositionInQuestions].text,
        Validators.required),
      'codeText': new FormControl(this.questions[this.currentPositionInQuestions].javaCode,
        Validators.required),
      'ingredients': new FormControl(this.questions[this.currentPositionInQuestions].choices,
        Validators.required)
    });
    // console.log(this.recipeForm.value);
  }
}
