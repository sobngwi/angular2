import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../../exam.model';

@Component({
  selector: 'app-exam-item',
  templateUrl: './exam-item.component.html',
  styleUrls: ['./exam-item.component.css']
})
export class ExamItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() index: number;
  constructor() { }

  ngOnInit() {
  }
}
