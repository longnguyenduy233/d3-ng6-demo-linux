import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Node, Link, D3Service } from '../../../d3';
import APP_CONFIG from '../../../app.config';

@Component({
  selector: '[linkVisual]',
  templateUrl: './link-visual.component.html',
  styleUrls: ['./link-visual.component.css']
})
export class LinkVisualComponent  implements OnInit{
  
  @Input('linkVisual') link: Link;
  @ViewChild('linkOverLay') linkOverLay: ElementRef;
  @ViewChild('eLabel') eLabel: ElementRef;
  linkCenterPoint = { x: 0, y: 0 };

  constructor(private d3Service: D3Service){};
  ngOnInit(): void {
  }
  
  mouseOverOnLink() {
    if(!APP_CONFIG.createLinkState)
      this.linkOverLay.nativeElement.style.opacity = '0.3';
  }
  mouseoutOnLink() {
    if(!APP_CONFIG.createLinkState)
      this.linkOverLay.nativeElement.style.opacity = '0';
  }
  focusOnNode () {
    if(!APP_CONFIG.createLinkState)
      this.d3Service.refreshEdgeMenuPosition({d:this.link,elem:this.eLabel.nativeElement});
      // else
        // this.d3Service.createRelationship(this.node);
  }
  calculationLinkCenterPointX(source: any, target: any) {
    return Math.abs(target.x - source.x) / 2 + (Math.min(target.x, source.x)) + 10;
    
  }
  calculationLinkCenterPointY(source: any, target: any) {
    return Math.abs(target.y - source.y) / 2 + (Math.min(target.y, source.y)) - 10;
  }
}
