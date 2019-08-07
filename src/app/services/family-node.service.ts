import {Injectable} from '@angular/core';
import FamilyNode from "../model/FamilyNode";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class FamilyNodeService {

  public myFamilyNodes: FamilyNode[] = [];
  public nodesAddedEvent: Subject<FamilyNode> = new Subject<FamilyNode>();
  me = new FamilyNode().withName("Artem");

  constructor() {
    this.nodesAddedEvent.subscribe(( event: FamilyNode ) => {
      this.myFamilyNodes.push(event);
    });
    this.populate();
    console.log(this.myFamilyNodes);
  }

  private populate() {

    const father = new FamilyNode().withChild(this.me).withName("Sergey");
    const slava2 = new FamilyNode().withName("Slava222").withSibling(father);
    const slava = new FamilyNode().withName("Slava").withSibling(father);
//    const mother = new FamilyNode().withChild(this.me).withName("Marianna");
//    const grandMother = new FamilyNode().withChild(father).withName("Musya");
//    const grandFather = new FamilyNode().withChild(father).withName("Valya").withSpouse(grandMother);
//    const grandGFather = new FamilyNode().withChild(mother).withName("Valya");
//    const grandGMother = new FamilyNode().withChild(mother).withName("Sveta");
//    this.nodesAddedEvent.next(this.me);
    this.nodesAddedEvent.next(father);
    this.nodesAddedEvent.next(slava);
    this.nodesAddedEvent.next(slava2);
//    this.nodesAddedEvent.next(mother);
//    this.nodesAddedEvent.next(grandFather);
//    this.nodesAddedEvent.next(grandMother);
//    this.nodesAddedEvent.next(grandGMother);
//    this.nodesAddedEvent.next(grandGFather);

  }

  public addNode() {
    const kira = new FamilyNode().withName("Kira").withParent(this.me);
    this.nodesAddedEvent.next(kira);
  }


}
