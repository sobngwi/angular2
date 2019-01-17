import { Ingredient } from '../shared/ingredient.model';
import {Choice} from '../shared/choice.model';
import {Chapter} from '../shared/chapter';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  private choices: Choice[];
  private  questions: Array<string> = new Array<string>();

  constructor(name: string, desc: string, imagePath: string, questions: Array<string>  ) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.questions = questions;
  }
}
