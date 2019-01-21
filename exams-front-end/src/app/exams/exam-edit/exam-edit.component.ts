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

  constructor(private route: ActivatedRoute,
              private examService: ExamService,
              private httpService: HttpService,
              private router: Router) {
  }
  private id: number;
  private editMode = false;
  private questionForm: FormGroup;
  private questions: Array<QuestionModel> = new Array<QuestionModel>();
  nbQuestions = 0;
  private currentPositionInQuestions = 0;
  private subscriptionParams: Subscription;
  private submittedQuestions: Array<number> = new Array<number>();

  private lineSplitter = /\r\n|\r|\n/;

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
        });
    this.nbQuestions = this.questions.length;
      for (let i = 0; i < this.nbQuestions ; i++) {
        this.submittedQuestions.push(0);  // use i instead of 0
      }
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
  }
  nextQuestion() {
    if ( this.currentPositionInQuestions === (this.nbQuestions - 1 ) ) {
      return ;
    }
    this.currentPositionInQuestions = this.currentPositionInQuestions + 1;
    this.setQuestionsOnEachChapter(this.id);
    this.initForm();
  }
  previousQuestion() {
    if ( this.currentPositionInQuestions === 0) {
      return ;
    }
    this.currentPositionInQuestions = this.currentPositionInQuestions - 1;
    this.setQuestionsOnEachChapter(this.id);
    this.initForm();
  }

  onSubmit() {
    this.submittedQuestions[this.currentPositionInQuestions] = 1 ;
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

  isDisable() {
    return this.currentPositionInQuestions === 0 ;
  }

  isAlreadySubmitted() {
    return this.submittedQuestions[this.currentPositionInQuestions] === 1;
  }

  isSingleChoice() {
    return this.questions[this.currentPositionInQuestions].type === 'Single Choice';
  }

  getNumberOfRowsForCodeTex() {
    return this.questions[this.currentPositionInQuestions].javaCode.split(this.lineSplitter).length;
  }

  getNumberOfRowsForQuestionText() {
    return this.questions[this.currentPositionInQuestions].text.split(this.lineSplitter).length;
  }
}
