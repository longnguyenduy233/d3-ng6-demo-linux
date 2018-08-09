import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { D3Service, ForceDirectedGraph, Node, Link } from '../../d3';
import { Subscription } from 'rxjs';
import { Entity, Relationship } from '../../models';
import { EntityService, RelationshipService } from '../../services';
import APP_CONFIG from '../../app.config';

@Component({
  selector: 'graph',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit, OnDestroy {

  // @Input('nodes') nodes;
  // @Input('links') links;
  // @Input('mapedEntityToNode') mapedEntityToNode: EventEmitter<Node[]>;
  nodes: Node[] = [];
  links: Link[] = [];
  entities: Entity[] = [];
  relationships: Relationship[] = [];
  graph: ForceDirectedGraph;
  private _options: { width, height } = { width: 800, height: 600 };
  endArrowPosition;
  private addedEntitySub: Subscription;
  private addedNodeSub: Subscription;
  private addedRelationshipSub: Subscription;
  private removedRelationshipSub: Subscription;
  private addedLinkSub: Subscription;
  private removedLinkSub: Subscription;
  

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }


  constructor(private d3Service: D3Service, private ref: ChangeDetectorRef, private entityService: EntityService, private relationshipService: RelationshipService) { }

  ngOnInit() {
    this.endArrowPosition = APP_CONFIG.R + 11;
    // this.addedEntitySub = this.mapedEntityToNode.subscribe((nodes: Node[]) => this.mapEntities(nodes));
    this.addedNodeSub = this.entityService.addedNode.subscribe((entity) => this.addNode(entity));
    this.addedEntitySub = this.entityService.addedEntity.subscribe((entities) => this.entities = entities);
    this.addedRelationshipSub = this.relationshipService.addedRelationship.subscribe((relationships) => this.createRelationship(relationships));
    this.removedRelationshipSub = this.relationshipService.removedRelationship.subscribe((relationships) => this.relationships = relationships);
    this.addedLinkSub = this.d3Service.addedLink.subscribe((link) => this.createTempLink(link));
    this.removedLinkSub = this.d3Service.removedLink.subscribe(() => this.removeTempLink());
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links.slice(0), this.options);

    /** Binding change detection check on each tick
     * This along with an onPush change detection strategy should enforce checking only when relevant!
     * This improves scripting computation duration in a couple of tests I've made, consistently.
     * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
     */
    this.graph.ticker.subscribe((d) => {
      // this.ref.markForCheck();
      // this.d3Service.refreshMenuPosition();
    });
  }
  ngOnDestroy(): void {
    this.addedEntitySub.unsubscribe();
    this.addedNodeSub.unsubscribe();
    // this.addedFieldSub.unsubscribe();
    this.addedRelationshipSub.unsubscribe();
    this.removedRelationshipSub.unsubscribe();
    // this.removeEntitySub.unsubscribe();
    // this.removeFieldSub.unsubscribe();
    this.addedLinkSub.unsubscribe();
    this.removedLinkSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.graph.initSimulation(this.options);
  }

  get options() {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight * 0.7
    };
  }
  // mapEntities(nodes): any {
  //   this.nodes = nodes;
  //   console.log(this.nodes);
  //   this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);
  //   this.graph.initSimulation(this.options);
  // }
  addNode(entity: Entity) {
    const entityNew: Entity = this.entityService.getEntityById(entity.getId());
    entityNew.x = this.options.width / 2;
    entityNew.y = this.options.height / 2;
    this.nodes = this.entities;
    // const node: Node = new Node(entity.getId());
    // node.x = this.options.width / 2;
    // node.y = this.options.height / 2;
    // this.nodes.push(node);
    // let links: Link[] = [];
    // if(this.nodes.length >= 2) {
    //    links.push(new Link(1,2));
    //           }
    // this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);
    // this.graph.nodes = [];
    // this.graph.initNodes();
    // this.graph.initSimulation(this.options, this.nodes,null);
    // this.links = links;
    // this.graph.simu
    this.graph.simulation.nodes(this.nodes);
    this.graph.simulation.alpha(1).restart();
  }
  createTempLink(link: Link) {
    this.removeTempLink();
    this.endArrowPosition = 0;
    this.links.push(link);
  }
  removeTempLink() {
    if(this.links.length>0){
      let lengthArray = this.links.length; 
      if(this.links[lengthArray - 1].isTemp) {
        this.links.splice(lengthArray - 1,1);
        this.endArrowPosition = APP_CONFIG.R + 11;
      }
    }
  }
  createRelationship(relationships: Relationship[]) {
    // this.links = [];
    this.relationships = relationships;
    // console.log(this.relationships);
    // let links: Link[] = [];
    // this.relationships.forEach(element => {
    //   let nodeFrom: Node = this.nodes.find((x) => x.id === element.getFromEntityId());
    //   let nodeTo: Node = this.nodes.find((x) => x.id === element.getToEntityId());
    //   links.push(new Link(nodeFrom,nodeTo));
    // });
    // let links = JSON.parse(JSON.stringify(this.relationships));
    let links = this.relationships.slice(0);
    // console.log(links);
    // this.graph = null;
    // this.graph = this.d3Service.getForceDirectedGraph(null, this.links, this.options);
    // this.graph.links = [];
    // this.graph.initLinks();
    // this.graph.simulation.force("links")
    // .links(this.graph.links);
    // this.graph.simulation = null;
    // this.graph.initSimulation(this.options, this.nodes,links);
    this.graph.simulation.force("link").links(links);
    this.graph.simulation.alpha(1).restart();

    this.endArrowPosition = APP_CONFIG.R + 11;
    this.links = links.slice(0);
  }
}
