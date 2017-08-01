import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly title: string = 'Implant Configurator';

  constructor(
    private titleService: Title,
  ) { }
 
  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
