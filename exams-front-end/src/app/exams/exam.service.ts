import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Recipe} from './exam.model';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';

@Injectable()
export class ExamService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Array<Recipe> = new Array<Recipe>();
  constructor(private slService: ShoppingListService) {}
  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
  }
  setIngredients( ingredients: Ingredient[] , index: number) {
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
}
