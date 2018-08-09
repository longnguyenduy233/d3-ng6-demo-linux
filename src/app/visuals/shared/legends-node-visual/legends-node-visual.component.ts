import { Component, OnInit, HostBinding, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Node } from '../../../d3';
import { Subscription } from 'rxjs';
import { EntityService } from '../../../services';
import { Entity } from '../../../models';

@Component({
  selector: '[legendsNodeVisual]',
  templateUrl: './legends-node-visual.component.html',
  styleUrls: ['./legends-node-visual.component.css']
})
export class LegendsNodeVisualComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('legendsNodeVisual') node: Node;
  @Input('legendsNodeVisualEntities') entities: Entity[] = [];
  @ViewChild('legendsNode') legendsNode: ElementRef;
  // @HostBinding('class.legendsNodeVisibility') legendsNodeVisibility = false;
  // entities: Entity[] = [];

  // private addedEntitySub: Subscription;
  constructor(private entityService: EntityService) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy() {
    // this.addedEntitySub.unsubscribe();
  }
  changeVisibility() {
    const node_origin: Node = this.entities.find((x) => x.id === this.node.id);
    if (node_origin.visibility) {
      // node.visibility = false;
      // this.legendsNodeVisibility = true;
      node_origin.visibility = false;
      this.legendsNode.nativeElement.style.opacity = '0.3';
    } else {
      // node.visibility = true;
      // this.legendsNodeVisibility = false;
      node_origin.visibility = true;
      this.legendsNode.nativeElement.style.opacity = '1';
    }
  }

}
