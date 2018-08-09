import { Component, Input, OnInit } from '@angular/core';
import { Node, D3Service } from '../../../d3';
import APP_CONFIG from '../../../app.config';

@Component({
  selector: '[nodeVisual]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent implements OnInit{
  @Input('nodeVisual') node: Node;
  nodeRadius;

  constructor(private d3Service: D3Service){};
  ngOnInit(): void {
    this.nodeRadius = this.node.r;
  }
  focusOnNode () {
    if(!APP_CONFIG.createLinkState)
      this.d3Service.refreshMenuPosition(this.node);
      else
        this.d3Service.createRelationship(this.node);
  }
  // focusOutNode () {
  //   this.d3Service.hideMenu(true);
  // }
  mouseOverOnNode (){
    if(APP_CONFIG.createLinkState)
      this.nodeRadius += 5
  }
  mouseoutOnNode (){
    if(this.nodeRadius > this.node.r)
      this.nodeRadius = this.node.r;
  }
}
