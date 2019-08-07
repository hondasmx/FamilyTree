import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {D3Service} from "../services/d3.service";
import FamilyNode from "../model/FamilyNode";

@Directive({
  selector: '[draggableNode]',
})
export class DraggableDirective implements OnInit {
  @Input('draggableNode') draggableNode: FamilyNode;

  constructor( private d3Service: D3Service, private _element: ElementRef ) {
  }

  ngOnInit() {
    this.d3Service.applyDraggableBehaviour(this._element.nativeElement, this.draggableNode);
  }
}
