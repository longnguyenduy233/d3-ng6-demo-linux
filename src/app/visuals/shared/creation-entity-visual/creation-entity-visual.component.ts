import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { EntityService } from '../../../services/entity.service';
import { Entity } from '../../../models/entity.model';
import { Relationship } from '../../../models/relationship.model';
import { Field } from '../../../models/field.model';
import { RelationshipService } from '../../../services/relationship.service';
import { FieldService } from '../../../services/field.service';
import { Subscription } from 'rxjs';
import { D3Service, Node } from '../../../d3';
import * as d3 from 'd3';

export enum ObjectTypes {
  Type1 = 'entity',
  Type2 = 'field',
  Type3 = 'relationship'
}

@Component({
  selector: 'app-creation-entity-visual',
  templateUrl: './creation-entity-visual.component.html',
  styleUrls: ['./creation-entity-visual.component.css']
})
export class CreationEntityVisualComponent implements OnInit, OnDestroy {
  @ViewChild('svgSubArea') svgSubArea: ElementRef;
  entities: Entity[] = [];
  relationships: Relationship[] = [];
  fields: Field[] = [];
  nodes: Node[] = [];
  x_position_latest;
  r;

  private addedEntitySub: Subscription;
  private addedFieldSub: Subscription;
  private addedRelationshipSub: Subscription;
  private removedRelationshipSub: Subscription;
  private removeEntitySub: Subscription;
  private removeFieldSub: Subscription;
  constructor(
    private entityService: EntityService,
    private relationshipService: RelationshipService,
    private fieldService: FieldService,
    private d3Service: D3Service
  ) { }
  get positions() {
    return {
      x: (this.x_position_latest) ? this.x_position_latest + this.r * 3 : this.r * 2,
      y: this.svgSubArea.nativeElement.clientHeight / 2
    };
  }
  ngOnInit() {
    this.addedEntitySub = this.entityService.addedEntity.subscribe((entities: Entity[]) => this.entities = entities);
    this.addedFieldSub = this.fieldService.addedField.subscribe((fields) => this.fields = fields);
    this.removeFieldSub = this.fieldService.removedField.subscribe((fields) => this.fields = fields);
    this.addedRelationshipSub = this.relationshipService.addedRelationship.subscribe((relationships) => this.relationships = relationships);
    this.removedRelationshipSub = this.relationshipService.removedRelationship.subscribe((relationships) => this.relationships = relationships);
  }
  ngOnDestroy() {
    this.addedEntitySub.unsubscribe();
    this.addedFieldSub.unsubscribe();
    this.addedRelationshipSub.unsubscribe();
    this.removedRelationshipSub.unsubscribe();
    this.removeEntitySub.unsubscribe();
    this.removeFieldSub.unsubscribe();
  }
  checkDuplicateName(name: String, type: any): boolean {
    let index: any;
    switch (type) {
      case ObjectTypes.Type1:
        index = this.entities.findIndex((x) => x.getName() === name);
        break;
      case ObjectTypes.Type3:
        index = this.relationships.findIndex((x) => x.getName() === name);
        break;
    }
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  }
  addEntity(): void {
    let id = this.entityService.getMaxEntityId() + 1;
    let entityName = 'NewEntity' + id;
    while (this.checkDuplicateName(entityName, ObjectTypes.Type1)) {
      id += 1;
      entityName = 'NewEntity' + id;
    }
    const entity: Entity = new Entity(
      id,
      entityName,
      entityName,
      0,
      0,
      0,
      0,
      'ENTITY_SHAPE',
      id,
      'modified'
    );
    this.entityService.addEntity(entity);
    // this.createEntityAPI(entity);
    const node: Node = new Node(entity.getId());
    this.r = node.r;
    node.x = this.positions.x;
    node.y = this.positions.y;
    node.linkCount = entity.linkCount;
    this.x_position_latest = node.x;
    this.nodes.push(node);
  }
  
  selectZoom(node: Node) {
    const node_origin: Node = this.entities.find((x) => x.id === node.id);
    const tx = (this.d3Service.options.width / 2) - (3 * node_origin.x);
    const ty = (this.d3Service.options.height / 2) - (3 * node_origin.y);
    // console.log(this.d3Service.options.width / 2);
    // let tx = ((this.d3Service.options.width / 2)) - node_origin.x;
    // let ty = ((this.d3Service.options.height / 2)) - node_origin.y;
    // console.log(tx);
    // this.d3Service.zoom_container.transition()
    // .duration(750).attr('transform', 'translate(' + tx + ',' + ty + ')scale(' + 3 + ')');
    // this.d3Service.zoom_container.attr('transform',  'scale(' + 2 + ')');
    // const t = d3.zoomIdentity.translate(tx, ty).scale(3);
    // this.d3Service.svg.call(this.d3Service.zoom.transform, t);
    // this.d3Service.zoom.transform = t;
    // this.d3Service.svg.call(this.d3Service.zoom);
    const t = d3.zoomIdentity.translate(tx, ty).scale(3);
    this.d3Service.svg.transition().duration(750).call(this.d3Service.zoom.transform, t);
  }

  zoomFit() {
    let paddingPercent = 0.95;
    let transitionDuration = 500;
    var bounds = this.d3Service.zoom_container.node().getBBox();
    var parent = this.d3Service.zoom_container.node().parentElement;
    var fullWidth = parent.clientWidth,
        fullHeight = parent.clientHeight;
    var width = bounds.width,
        height = bounds.height;
    var midX = bounds.x + width / 2,
        midY = bounds.y + height / 2;
    if (width == 0 || height == 0) return; // nothing to fit
    var scale = (paddingPercent || 0.75) / Math.max(width / fullWidth, height / fullHeight);
    var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
  
  //   let zoom = d3
	// .zoom()
	// .scaleExtent([1/4, 4])
	// .on('zoom.zoom', function () {
	// 	console.trace("zoom", d3.event.translate, d3.event.scale);
	// 	this.d3Service.zoom_container.attr('transform',
	// 		'translate(' + d3.event.translate + ')'
	// 		+   'scale(' + d3.event.scale     + ')');
	// });
    // console.trace("zoomFit", translate, scale);
    // this.d3Service.zoom_container
    //   .transition()
    //   .duration(transitionDuration || 0) // milliseconds
    //   .call(zoom.translate(translate).scale(scale).event);
    const t = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);
    this.d3Service.svg.transition().duration(transitionDuration).call(this.d3Service.zoom.transform, t);
  }
}
