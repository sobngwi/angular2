import { EventEmitter, Injectable } from '@angular/core';
import {Observable, Subject, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Recipe } from './exam.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import {HttpClient, HttpClientModule, HttpErrorResponse} from '@angular/common/http';

export interface Qu {
  chapitre: string;
  choices: String[];
  exam: String;
  javaCode: string;
  subject: string;
  text: string;
  type: string;
}
@Injectable()
export class ExamService {
  // 'http://localhost:8080/question/search/chapter/1'; //'assets/chapter.json';
  private question : Qu;
  configUrl = 'http://localhost:8080/question/1';
  recipeSelected = new EventEmitter<Recipe>();
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [
    new Recipe(
      'Advanced Design Pattern.',
      'Questions on Design Patterns.',
      'https://upload.wikimedia.org/wikipedia/commons/8/8d/Design_pattern_fabrique.png',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20)
      ]),
    new Recipe('Assertions and Exceptions',
      'Questions on Exceptions Handling.',
      'https://beginnersbook.com/wp-content/uploads/2013/04/Exception-classes-hierarchy.jpg',
      [
        new Ingredient('Success', 1),
        new Ingredient('Failure', 2),
        new Ingredient('The hashCode() method fails to compile.', 1),
        new Ingredient('The equals() method fails to compile.', 1),
        new Ingredient('Another line of code fails to compile.', 2),
        new Ingredient('A runtime exception is thrown.', 2)
      ])
  ];

  constructor(private slService: ShoppingListService, private http: HttpClient) {
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  setIngredients( ingredients: Ingredient[] , index : number) {
    this.getRecipe(index).ingredients = ingredients;
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  getChapterById() {
    console.log('Going to perform a http request');
    return this.http.get<Qu>(
      this.configUrl, {observe: 'response'});
  }

}
