import {Component, OnInit} from '@angular/core';
import {ExamService} from './exam.service';
import {HttpService} from '../shared/http.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css'],
  providers: [ExamService, HttpService]
})
export class ExamsComponent implements OnInit {

  constructor() { }
  ngOnInit() {}
}
