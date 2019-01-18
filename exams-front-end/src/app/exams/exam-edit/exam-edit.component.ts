import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
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
  private id: number;
  private editMode = false;
  private questionForm: FormGroup;
  private questions: Array<QuestionModel> = new Array<QuestionModel>();
  private currentPositionInQuestions = 0;
  private subscriptionParams: Subscription;
  choiceSelected: any;

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
    this.questionForm.valueChanges.subscribe(
      (status) => console.log('this status changed', status)
    );
      this.questionForm.valueChanges.subscribe(
        (value) => console.log('this value changed', value)
    );
  }
  ngOnDestroy(): void {
    this.subscriptionParams.unsubscribe();
  }
  onSelectionChange(entry) {
    console.log(entry);
    this.choiceSelected = entry;
  }
  onCancel(questionForm) {
    // this.router.navigate(['../'], {relativeTo: this.route});
    questionForm = null;
    this.questionForm = null;
    console.log(questionForm);
    console.log(this.questions);
    this.questions = [];
    console.log(this.questions);
    this.setQuestionsOnEachChapter(this.id);
    this.initForm();
    console.log(this.questions);
  }
  nextQuestion() {
    this.currentPositionInQuestions = this.currentPositionInQuestions + 1;
    this.setQuestionsOnEachChapter(this.id);
    this.initForm();
    console.log(this.currentPositionInQuestions);
  }
  previousQuestion() {
    this.currentPositionInQuestions = this.currentPositionInQuestions - 1;
    this.setQuestionsOnEachChapter(this.id);
    this.initForm();
    console.log(this.currentPositionInQuestions);
  }
  onReset() {
    console.log(this.currentPositionInQuestions);
   // this.currentPositionInQuestions = 0;
    this.setQuestionsOnEachChapter(this.id);
    this.initForm();
  }
  onSubmit() {
  }
  private initForm() {
    this.questionForm = new FormGroup({
      'idQuestion': new FormControl( this.questions[this.currentPositionInQuestions].id,
        [Validators.required, Validators.maxLength(8)]),
      'questionText': new FormControl(this.questions[this.currentPositionInQuestions].text,
        Validators.required),
      'codeText': new FormControl(this.questions[this.currentPositionInQuestions].javaCode,
        Validators.nullValidator),
      'choices': new FormControl(this.questions[this.currentPositionInQuestions].choices,
        [Validators.nullValidator/*, this.minSelectedCheckboxes(1)*/])
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

  private onSelectValidation(control: FormControl): {[s: string]: boolean} {
    if ( this.questionForm.get('choices').untouched) {
      return {'screenTouched': false};
     // return null;
    }
    return null;
  }
   minSelectedCheckboxes (min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
      // get a list of checkbox values (boolean)
        .map(control => control.value)
        // total up the number of checked checkboxes
        .reduce((prev, next) => next ? prev + next : prev, 0);

      // if the total is not greater than the minimum, return the error message
      return totalSelected >= min ? null : { required: true };
    };

    return validator;
  }
}
