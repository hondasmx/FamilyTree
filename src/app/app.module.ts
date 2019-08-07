import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FamilyNodeComponent} from './family-node/family-node.component';
import {ZoomableDirective} from "./directives/zoomable.directive";
import {D3Service} from "./services/d3.service";
import {DraggableDirective} from "./directives/draggable.directive";

@NgModule({
  declarations: [
    AppComponent,
    FamilyNodeComponent,
    ZoomableDirective,
    DraggableDirective,

  ],
  imports: [
    BrowserModule,
  ],
  providers: [D3Service],
  bootstrap: [AppComponent],
})
export class AppModule {
}
