import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy, HostBinding } from '@angular/core';
import { EntityService } from '../../../services';
import { Entity } from '../../../models';
import { Node } from '../../../d3';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-legends-visual',
  templateUrl: './legends-visual.component.html',
  styleUrls: ['./legends-visual.component.css']
})
export class LegendsVisualComponent implements OnInit, OnDestroy {
  entities: Entity[] = [];
  nodes: Node[] = [];
  @ViewChild('svgLegends') svgLegends: ElementRef;
  @ViewChild('legendsNode') legendsNode: ElementRef;
  y_position_latest;
  r;

  private addedNodeSub: Subscription;
  private addedEntitySub: Subscription;

  constructor(private entityService: EntityService) { }
  get positions() {
    return {
      y: (this.y_position_latest) ? this.y_position_latest + this.r * 2 : this.r * 2,
      x: this.svgLegends.nativeElement.clientWidth / 2
    };
  }
  ngOnInit() {
    this.addedNodeSub = this.entityService.addedNode.subscribe((entity: Entity) => this.addNode(entity));
    this.addedEntitySub = this.entityService.addedEntity.subscribe((entities: Entity[]) => this.entities = entities);
  }
  ngOnDestroy() {
    this.addedNodeSub.unsubscribe();
    this.addedEntitySub.unsubscribe();
  }
  addNode(entity) {
    const node: Node = new Node(entity.getId());
    this.r = node.r;
    node.x = this.positions.x;
    node.y = this.positions.y;
    node.linkCount = entity.linkCount;
    this.y_position_latest = node.y;
    this.nodes.push(node);
  }
}
