import { Component, OnInit } from '@angular/core';
import {f_busmap} from "./busmap";

@Component({
  selector: 'app-routemap',
  templateUrl: './routemap.component.html',
  styleUrls: ['./routemap.component.scss']
})
export class RoutemapComponent implements OnInit {


  constructor() { }

  ngOnInit() {
    f_busmap();
  }

}
