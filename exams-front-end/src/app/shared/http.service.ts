import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../exams/exam.model';
import {map} from 'rxjs/operators';


export class HttpService {
  executeSynchronousRequest( url: string) {
    // console.log('starting execution of sync request');
    let data;
    const request = new XMLHttpRequest();
    request.open('GET',
      url,
      false);  // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
         data = JSON.parse(request.responseText);
      // console.log(data);
    }
    return data;
  }
  /*
  getRecipes() {
    // this.httpClient.get<Recipe[]>('https://ng-recipe-book-3adbb.firebaseio.com/recipes.json?auth=' + token)
    this.httpClient.get<Recipe[]>('https://ng-recipe-book-3adbb.firebaseio.com/recipes.json', {
      observe: 'body',
      responseType: 'json'
    }).pipe(
    map(
        (recipes) => {
          console.log(recipes);
          for (let recipe of recipes) {
            if (!recipe['ingredients']) {
              recipe['ingredients'] = [];
            }
          }
          return recipes;
        }
      )).subscribe(
        (recipes: Recipe[]) => {
          // this.examService.getRecipes();// .setRecipes(recipes);
        }
      );
  }
*/
}
