import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../exams/exam.model';
import {map} from 'rxjs/operators';
import {QuestionModel} from './question.model';

@Injectable()
export class HttpService {

  constructor(private httpClient: HttpClient) {
  }

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
    }
    return data;
  }
  simpleGet(url: string) {
   // return this.httpClient.get<QuestionModel[]>('url');
    return this.httpClient.get<Array<QuestionModel>>( url , {
      observe: 'body',
      responseType: 'json'
    }).pipe(
      map(
        (chapters) => {
          return chapters;
        }
      ));
      /*.subscribe(
        (recipes: Array<QuestionModel>) => {
          // this.recipeService.setRecipes(recipes);
        }
      );*/

  }
}
