import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  allowNewServer = false;
  intVal = 5 ;
  serverCreationStatus = 'No server was created';
  serverName = 'Default Server Name';
  serverCreated = false;
  servers = ['A', 'B', 'C', 'D', 'E'];

  constructor() {

    setTimeout(() => {this.intVal = 10; this.allowNewServer = true; }
      , 2000);
  }
  ngOnInit() {
  }

  onCreateServer() {
    this.servers.push(this.serverName);
    this.serverCreated = true;
    this.serverCreationStatus = 'Server was created.';
  }

  onUpdateServerName( event: /*any*/  Event) {
    // console.log(event);
    this.serverName = (<HTMLInputElement>event.target).value;
  }

}
