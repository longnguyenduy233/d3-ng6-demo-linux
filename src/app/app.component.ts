import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import APP_CONFIG from './app.config';
import { Node, Link } from './d3';
import { Entity } from './models/entity.model';
import { Relationship } from './models/relationship.model';
import { Subscription } from 'rxjs';
import { EntityService, RelationshipService, FieldService } from './services';
import { Field } from './models/field.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  // nodes: Node[] = [];
  // links: Link[] = [];
  // entities: Entity[] = [];
  // relationships: Relationship[] = [];
  // fields: Field[] = [];
  // i = 0;

  mapedEntityToNode = new EventEmitter<Node[]>();

  // private addedEntitySub: Subscription;
  // private addedFieldSub: Subscription;
  // private addedRelationshipSub: Subscription;
  // private removedRelationshipSub: Subscription;
  // private removeEntitySub: Subscription;
  // private removeFieldSub: Subscription;
  constructor(
    // private entityService: EntityService,
    // private relationshipService: RelationshipService,
    // private fieldService: FieldService
  ) {
    // const N = APP_CONFIG.N,
    //   getIndex = number => number - 1;

    /** constructing the nodes array */
    // for (let i = 1; i <= 2; i++) {
    //   this.nodes.push(new Node(i));
    // }

    // for (let i = 1; i <= N; i++) {
    //   for (let m = 2; i * m <= N; m++) {
    //     /** increasing connections toll on connecting nodes */
    //     this.nodes[getIndex(i)].linkCount++;
    //     this.nodes[getIndex(i * m)].linkCount++;

    //     /** connecting the nodes before starting the simulation */
    //     this.links.push(new Link(i, i * m));
    //   }
    // }
  }
  ngOnInit() {
    // this.addedEntitySub = this.entityService.addedEntity.subscribe((entities: Entity[]) => this.mapEntities(entities));
    // this.addedFieldSub = this.fieldService.addedField.subscribe((fields) => this.fields = fields);
    // this.removeFieldSub = this.fieldService.removedField.subscribe((fields) => this.fields = fields);
    // this.addedRelationshipSub = this.relationshipService.addedRelationship.subscribe((relationships) => this.relationships = relationships);
    // this.removedRelationshipSub = this.relationshipService.removedRelationship.subscribe((relationships) => this.relationships = relationships);
  }
  ngOnDestroy() {
    // this.addedEntitySub.unsubscribe();
    // this.addedFieldSub.unsubscribe();
    // this.addedRelationshipSub.unsubscribe();
    // this.removedRelationshipSub.unsubscribe();
    // this.removeEntitySub.unsubscribe();
    // this.removeFieldSub.unsubscribe();
  }
  // mapEntities(entities): any {
  //   this.entities = entities;
  //   const nodes: Node[] = [];
  //   this.entities.forEach(element => {
  //     nodes.push(new Node(element.getId()));
  //   });
  //   this.nodes = nodes;
  //   this.mapedEntityToNode.emit(this.nodes);
  //   // console.log(this.nodes);
  // }
  // addEntity() {
  //   this.i += 1;
  //   this.nodes.push(new Node(this.i));
  //   // console.log(this.nodes);
  // }
}
