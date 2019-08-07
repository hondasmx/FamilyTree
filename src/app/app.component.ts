import {Component} from '@angular/core';
import {FamilyNodeService} from "./services/family-node.service";
import FamilyNode from "./model/FamilyNode";
import {Observable, Subscription} from "rxjs";
import LineCoordinates from "./model/LineCoordinates";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  myFamilyNodes: FamilyNode[] = [];
  title = 'FamilyTree';

  constructor( private service: FamilyNodeService ) {
    this.myFamilyNodes = service.myFamilyNodes;
    service.nodesAddedEvent.subscribe(( event: FamilyNode ) => {
      this.myFamilyNodes = service.myFamilyNodes;
    });
  }

  public btnClick() {
    this.service.addNode()
  }
}

