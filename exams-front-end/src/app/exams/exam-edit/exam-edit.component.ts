import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ExamService} from '../exam.service';
import {Subscription} from 'rxjs';
import {HttpServiceService} from '../http-service.service';

export interface QuestiDetail {
  id: string;
  chapitre: string;
  choices: String[];
  exam: String;
  javaCode: string;
  subject: string;
  text: string;
  type: string;
}

@Component({
  selector: 'app-exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.css'],
  providers: [HttpServiceService]
})
export class ExamEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private questions: Array<QuestiDetail> = new Array<QuestiDetail>();
  private currentPositionInQuestions = 0;
  private subscriptionParams: Subscription;

  constructor(private route: ActivatedRoute,
              private examService: ExamService,
              private httpService: HttpServiceService,
              private router: Router) {
  }

  ngOnInit() {
    this.subscriptionParams = this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          console.log(this.id);
          console.log(this.examService.getRecipe(this.id));
          console.log(this.examService.synchronousGetDatasFromBackEnd('http://localhost:8080/question/search/chapter/'
            + this.examService.getRecipe(this.id).name));
          this.examService.synchronousGetDatasFromBackEnd('http://localhost:8080/question/search/chapter/'
            + this.examService.getRecipe(this.id).name).forEach(
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
          console.log((this.questions));
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
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    var data = this.examService.synchronousGetDatasFromBackEnd('http://localhost:8080/question/1');

    if (this.editMode) {
      const recipe = this.examService.getRecipe(this.id);
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              // 'name': new FormControl(ingredient.name, Validators.required),
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
        Validators.required) // recipeIngredients
    });
     console.log(this.recipeForm);
  }
}
