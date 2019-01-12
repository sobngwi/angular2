import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {ExamService, Qu} from '../exam.service';
import {Subscription} from 'rxjs';
import {async} from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.css']
})
export class ExamEditComponent implements OnInit, OnDestroy{
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private question: Qu;
  private headers: string[];
  private subscriptionParams : Subscription;
  private subscriptionRequest : Subscription;
  constructor( private route: ActivatedRoute,
  private examService: ExamService,
  private router: Router) { }



  ngOnInit() {
    this.subscriptionRequest =
    this.examService.getChapterById().subscribe(

      resp => {
        this.question = resp.body;
        console.log(resp.body);},
      err => console.error(err),
      () => {
        console.log('done, Reception OK') ;
      }
    );
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
this.subscriptionRequest.unsubscribe();
  }

  onCancel() {

    console.log(this.question);
    this.examService.getChapterById().subscribe(
      resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
       // this.question=resp.body;
      });
    console.log('call on Oncancel');
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']);
    if (this.editMode) {
      this.examService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.examService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }
  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }
  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    var request = new XMLHttpRequest();
    request.open('GET',
      'http://localhost:8080/question/question/1',
      false);  // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
      //this.question = request.response;
      console.log(request.response);

    }
    var data = JSON.parse(request.responseText);
    console.log(data[0].subject);
    console.log(data[0].text);
    console.log(data[0].javaCode);
    console.log(data[0].choices);

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
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'idQuestion': new FormControl(data[0].id, Validators.required),
      'questionText': new FormControl( data[0].text,
        Validators.required),
      'codeText': new FormControl(data[0].javaCode
        .replace('\\n', '&#13;&#10;')),
      'ingredients': recipeIngredients
    });
   // console.log(this.recipeForm);
  }
}
