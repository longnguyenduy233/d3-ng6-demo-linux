import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GraphComponent } from './visuals/graph/graph.component';
import { SHARED_VISUALS } from './visuals/shared';
import { D3Service, D3_DIRECTIVES } from './d3';
import { CreationEntityVisualComponent } from './visuals/shared/creation-entity-visual/creation-entity-visual.component';
import { MenuVisualComponent } from './visuals/shared/menu-visual/menu-visual.component';
import { EntityService, RelationshipService, FieldService } from './services';
import { LegendsVisualComponent } from './visuals/shared/legends-visual/legends-visual.component';
import { LegendsNodeVisualComponent } from './visuals/shared/legends-node-visual/legends-node-visual.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    CreationEntityVisualComponent,
    MenuVisualComponent,
    LegendsVisualComponent,
    LegendsNodeVisualComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    D3Service,
    EntityService,
    RelationshipService,
    FieldService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
