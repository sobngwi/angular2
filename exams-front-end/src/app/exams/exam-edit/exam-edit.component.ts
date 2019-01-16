import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ExamService, Qu} from '../exam.service';
import {Subscription} from 'rxjs';
import {HttpServiceService} from '../http-service.service';

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
  private question: Qu;
  private headers: string[];
  private subscriptionParams: Subscription;
  private subscriptionRequest: Subscription;

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
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    var data = this.examService.synchronousGetDatasFromBacKend('http://localhost:8080/question/1');

    if (this.editMode) {
      const recipe = this.examService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
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
      // 'name': new FormControl(recipeName, Validators.required),
      // 'imagePath': new FormControl(recipeImagePath, Validators.required),
     // 'description': new FormControl(recipeDescription, Validators.required),
      'idQuestion': new FormControl(data.id, Validators.required),
      'questionText': new FormControl(data.text,
        Validators.required),
      'codeText': new FormControl(data.javaCode
        .replace('\\n', '&#13;&#10;')),
      'ingredients': recipeIngredients
    });
    // console.log(this.recipeForm);
  }
}
