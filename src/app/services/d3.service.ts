import {Injectable} from '@angular/core';
import * as d3 from 'd3';
import FamilyNode from "../model/FamilyNode";

@Injectable()
export class D3Service {
  constructor() {
  }

  applyZoomableBehaviour( svgElement, containerElement ) {
    let svg, container, zoomed, zoom;

    svg = d3.select(svgElement);
    container = d3.select(containerElement);

    zoomed = () => {
      const transform = d3.event.transform;
      container.attr('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.k + ')');
    };

    zoom = d3.zoom().on('zoom', zoomed);
    svg.call(zoom);
  }

  applyDraggableBehaviour( element, node: FamilyNode ) {
    const d3element = d3.select(element);

    function started() {
      d3.event.sourceEvent.stopPropagation();

      d3.event.on('drag', dragged).on('end', ended);

      function dragged() {
        node.x = d3.event.x;
        node.y = d3.event.y;
      }

      function ended() {
        node.x = d3.event.x;
        node.y = d3.event.y;
      }
    }

    d3element.call(d3.drag()
      .on('start', started));
  }
}
