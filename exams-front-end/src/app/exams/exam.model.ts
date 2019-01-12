import { Ingredient } from '../shared/ingredient.model';
import {Choice} from '../shared/choice.model';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  private choices: Choice[];

  constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[]) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }

  public of(name: string, desc: string, imagePath: string, choices: Choice[]) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.choices = choices;
    return this;
  }

}
