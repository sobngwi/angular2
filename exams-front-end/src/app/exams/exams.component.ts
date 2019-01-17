import {Component, OnInit} from '@angular/core';
import {ExamService} from './exam.service';
import {HttpServiceService} from './http-service.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css'],
  providers: [ExamService, HttpServiceService]
})
export class ExamsComponent implements OnInit {
  constructor() { }
  ngOnInit() {}
}
