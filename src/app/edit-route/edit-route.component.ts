import { Component, OnInit } from '@angular/core';
import {Station} from '../../lib/Station';
import {Route} from '../../lib/Route';
import {RouteService} from './route.service';

@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.scss']
})
export class EditRouteComponent implements OnInit {
  private route:Route=null;

  constructor(private routeService:RouteService) { }

  ngOnInit() {
    this.routeService.getRoute().subscribe(route=>this.route=route);
  }

}
