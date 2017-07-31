import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
// import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // readonly titleOriginal: string = 'Implant Configurator';
  // title = this.titleOriginal;
  readonly title: string = 'Implant Configurator';

  constructor(
    private titleService: Title,
    // private dataService: DataService
  ) { }
 
  ngOnInit() {
    // this.dataService.materialSelected$.subscribe(material => this.title = this.titleOriginal + ' for ' + material);
    this.titleService.setTitle(this.title);
  }
}
