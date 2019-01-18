import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ExamService} from '../exam.service';
import {Subscription} from 'rxjs';
import {HttpService} from '../../shared/http.service';
import {QuestionModel} from '../../shared/question.model';

@Component({
  selector: 'app-exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.css'],
  providers: [HttpService]
})
export class ExamEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  questionForm: FormGroup;
  private questions: Array<QuestionModel> = new Array<QuestionModel>();
  private currentPositionInQuestions = 0;
  private subscriptionParams: Subscription;

  constructor(private route: ActivatedRoute,
              private examService: ExamService,
              private httpService: HttpService,
              private router: Router) {
  }

    ngOnInit() {
      /* this.httpService.simpleGet('http://localhost:8080/question/search/chapter/1').subscribe(
        (chap1: Array<QuestionModel>) => {
          console.log(chap1);
        }
      ); */
    this.subscriptionParams = this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.setQuestionsOnEachChapter(this.id);
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
    this.onCancel();
  }
  private initForm() {
    this.questionForm = new FormGroup({
      'idQuestion': new FormControl( this.questions[this.currentPositionInQuestions].id,
        Validators.required),
      'questionText': new FormControl(this.questions[this.currentPositionInQuestions].text,
        Validators.required),
      'codeText': new FormControl(this.questions[this.currentPositionInQuestions].javaCode,
        Validators.required),
      'choices': new FormControl(this.questions[this.currentPositionInQuestions].choices,
        Validators.required)
    });
    // console.log(this.recipeForm.value);
  }
  private setQuestionsOnEachChapter( id: number) {
    this.httpService
      .executeSynchronousRequest('http://localhost:8080/question/search/chapter/' + this.examService.getRecipe(id).name).
    forEach(
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
  }
}
