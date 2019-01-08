import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-servers',
  /*template: `
    <app-server></app-server>
    <app-server></app-server>`,*/
  // '<app-server></app-server><app-server></app-server>',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  allowNewServer = false;
  intVal = 5 ;
  serverCreationStatus = 'No server was created';
  serverName = '';
  constructor() {
    setTimeout(() => {this.intVal = 10; this.allowNewServer = true; }
      , 2000);
  }
  ngOnInit() {
  }

  onCreateServer() {
    this.serverCreationStatus = 'Server was created.';
  }

  onUpdateServerName( event: /*any*/  Event) {
    // console.log(event);
    this.serverName = (<HTMLInputElement>event.target).value;
  }
}
