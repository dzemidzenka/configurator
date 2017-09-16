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
    private _titleService: Title,
  ) { }

  ngOnInit() {
    this._titleService.setTitle(this.title);
  }
}



    // const box = x => ({
    //   map: f => box(f(x)),
    //   inspect: () => console.log(x)
    // })
    // const result = box(3).map(x => x + 3).map( x=> x*2).inspect();