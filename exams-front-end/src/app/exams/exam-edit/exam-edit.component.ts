import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ExamService} from '../exam.service';
import {Subscription} from 'rxjs';
import {HttpService} from '../../shared/http.service';
import {QuestionModel} from '../../shared/question.model';
import {SolutionModel} from '../../shared/solution.model';

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
  questions: Array<QuestionModel> = new Array<QuestionModel>();
  solutions: Array<SolutionModel> = new Array<SolutionModel>();
  nbQuestions = 0;
  currentPositionInQuestions = 0;
  private subscriptionParams: Subscription;
  private submittedQuestions: Array<number> = new Array<number>();
  private lineSplitter = /\r\n|\r|\n/;
  private optionsMap = {};
  private optionsChecked = [];
  private yourSolution: string;
  canShowTheAnswer: boolean;

  ngOnInit() {
    /* this.httpService.simpleGet('http://localhost:8080/question/search/chapter/1').subscribe(
      (chap1: Array<QuestionModel>) => {
        console.log(chap1);
      }
    ); */
    /*
  this.questionForm.valueChanges.subscribe(
    (status) => console.log('this status changed', status)
  );
  this.questionForm.valueChanges.subscribe(
    (value) => console.log('this value changed', value)
  );*/
    this.subscriptionParams = this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.setQuestionsOnEachChapter(this.id);
          this.initForm();

        });
    this.optionsChecked = [];
    this.optionsMap = {};
    this.nbQuestions = this.questions.length;
    for (let i = 0; i < this.nbQuestions; i++) {
      this.submittedQuestions.push(0);
    }
  }
  ngOnDestroy(): void {
    this.subscriptionParams.unsubscribe();
  }
  private setQuestionsOnEachChapter(id: number) {
    this.httpService
      .executeSynchronousRequest('http://localhost:8080/question/search/chapter/' + this.examService.getRecipe(id).name).forEach(
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
  private initForm() {
    this.questionForm = new FormGroup({
      'idQuestion': new FormControl(this.questions[this.currentPositionInQuestions].id,
        [Validators.required, Validators.maxLength(8)]),
      'questionText': new FormControl(this.questions[this.currentPositionInQuestions].text,
        Validators.required),
      'codeText': new FormControl(this.questions[this.currentPositionInQuestions].javaCode,
        Validators.nullValidator),
      'choices': new FormControl(this.questions[this.currentPositionInQuestions].choices,
        [Validators.nullValidator])
    });
  }
  onSelectionChange(choice, entry) {
    this.optionsMap[choice] = entry.target.checked;
    for (const x in this.optionsMap) {
      if (this.optionsMap[x]) {
      }
    }
  }

  nextQuestion() {
    if (this.currentPositionInQuestions === (this.nbQuestions - 1)) {
      return;
    }
    this.currentPositionInQuestions = this.currentPositionInQuestions + 1;
    this.optionsMap = {};
    this.optionsChecked = [];
    this.yourSolution = '';
    if ( ! this.submittedQuestions[this.currentPositionInQuestions] ) {
      this.setQuestionsOnEachChapter(this.id);
      this.initForm();
    }
  }

  previousQuestion() {
    if (this.currentPositionInQuestions === 0) {
      return;
    }
    this.currentPositionInQuestions -= 1;
    this.setQuestionsOnEachChapter(this.id);
    this.initForm();
  }
  onSubmit() {
    this.submittedQuestions[this.currentPositionInQuestions] = 1;
    for (const x in this.optionsMap) {
      if (this.optionsMap[x]) {
        this.optionsChecked.push(x);
        console.log('option checked value = ', x );
      }
     const solution = this.httpService.executeSynchronousRequest('http://localhost:8080/solution/search/'
      + this.questions[this.currentPositionInQuestions].id);
     this.solutions.push({
       reasons : solution.reasons,
       id: solution.id,
       chapitre: solution.chapitre,
       choice: solution.choice,
     });
     this.yourSolution = '';
      this.optionsChecked.forEach(
        value => this.yourSolution += value + '\n'
      );
      console.log(this.yourSolution);
      console.log(solution);
      this.canShowTheAnswer = false;
    }
    this.optionsMap = {};
    this.optionsChecked = [];
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
    return this.questions[this.currentPositionInQuestions].text.split(this.lineSplitter).length + 1;
  }

  getColor() {
    if ( this.submittedQuestions[this.currentPositionInQuestions] === 1) {
      return 'green';
    } else if (this.submittedQuestions[this.currentPositionInQuestions] !== 1) {
      return '';
    } else {
      return '';
    }
  }

  viewTheAnswer() {
    this.canShowTheAnswer = true;
   let solution: SolutionModel = new class implements SolutionModel {
     chapitre = '';
     choice = '';
     id = '';
     reasons = '';
   };
    const BreakException = {};
    try {
      this.solutions.forEach(
        value => {
          if (value.id === this.questions[this.currentPositionInQuestions].id) {
            solution = value;
          }
        }
      );
    } catch (e) {
      if (e !== BreakException) { throw e; }
    }
    return (solution.choice  + '\n'   + solution.reasons +
    '---> Your choice :' + this.yourSolution);
  }
}
