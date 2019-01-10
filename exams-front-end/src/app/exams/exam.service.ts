import { EventEmitter, Injectable } from '@angular/core';

import { Recipe } from './exam.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class ExamService {
  recipeSelected = new EventEmitter<Recipe>();

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
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1)
      ])
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}
