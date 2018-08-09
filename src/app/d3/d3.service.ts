import { Injectable, EventEmitter } from '@angular/core';
import { Node, Link, ForceDirectedGraph } from './models';
import { RelationshipService } from '../services'
import * as d3 from 'd3';
import './styles/d3.css';
import APP_CONFIG from '../app.config';

@Injectable()
export class D3Service {
  zoom_container;
  svg;
  zoom;
  options: { width, height };
  r = APP_CONFIG.R;
  nodes: Node[] = [];
  addedLink = new EventEmitter<Link>();
  removedLink = new EventEmitter<{}>();

  constructor(private relationshipService: RelationshipService) { }

  applyZoomableBehaviour(svgElement, containerElement) {
    let svg, container, zoomed, zoom;
    svg = d3.select(svgElement);
    container = d3.select(containerElement);
    this.svg = svg;
    this.zoom_container = container;
    zoomed = () => {
      const transform = d3.event.transform;
      container.attr('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.k + ')');
    };

    zoom = d3.zoom().on('zoom', zoomed);
    this.zoom = zoom;
    svg.call(zoom);
  }

  applyDraggableBehaviour(element, node: Node, graph: ForceDirectedGraph) {
    // let started, dragged, ended;
    let hideMenu = this.hideMenu;
    const d3element = d3.select(element);
    function started() {
      /** Preventing propagation of dragstart to parent elements */
      d3.event.sourceEvent.stopPropagation();

      if (!d3.event.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }

      d3.event.on('drag', dragged).on('end', ended);
      function dragged() {
        node.fx = d3.event.x;
        node.fy = d3.event.y;
        // hideMenu();
      }
      
      
      function ended() {
        if (!d3.event.active) {
          graph.simulation.alphaTarget(0);
        }
        node.fx = null;
        node.fy = null;
      }
    }
    
    d3element.call(d3.drag()
    .on('start', started));
  }

  getForceDirectedGraph(nodes: Node[], links: Link[], options: { width, height }) {
    this.nodes = nodes;
    const sg = new ForceDirectedGraph(nodes, links, options);
    this.options = options;
    return sg;
  }
  OVertexMenu(zoomElement) {
    let seft = this;
    let selectedNode: Node;
    let zoomE = d3.select(zoomElement);
    // line displayed when dragging new nodes
    // let drag_line = zoomE.append('svg:path')
    // .attr('class', 'link dragline hidden')
    // .attr('d', 'M0,0L0,0');
    let menuContainer = zoomE.append("g");
    menuContainer.attr("class", "menu menu-hide");
    let arc = d3.arc()
      .innerRadius(this.r)
      .outerRadius(this.r + 40);
    let pie = d3.pie()
    .sort(null)
    .value((d) => { return 1; });
    let menuGroup = menuContainer.selectAll("g")
      .data(pie(APP_CONFIG.menu))
      .enter()
      .append("g")
      .attr("class", "menu-entry")
      .on("click", (d) => {
        d3.event.stopPropagation();
        function mousemove() {
          let endPosition = {x: d3.mouse(), y:d3.event.clientY};
          seft.createTempLink(endPosition,selectedNode);
        }
        
        function mouseClick() {
          let endPosition = {x: d3.event.x, y:d3.event.y};
          let w = d3.select(zoomElement.parentNode);
          w.on("mousemove", null).on("click", null);
          // createRelationship(selectedNode,endPosition,nodeArray);
        }
        if(d.data.placeholder === 'Connect'){
          APP_CONFIG.createLinkState = true;
          this.hideMenu();
          let w = d3.select(zoomElement.parentNode)
      .on("mousemove", function(){
        let endPosition = {x: d3.mouse(zoomE.node())[0], y:d3.mouse(zoomE.node())[1]};
          seft.createTempLink(endPosition,selectedNode);
          // self.drag_line.attr('d', 'M' + self.dragNode.x + ',' + self.dragNode.y + 'L' + d3.mouse(self.svg.node())[0] + ',' + d3.mouse(self.svg.node())[1]);
      })
      .on("click", function() {
          APP_CONFIG.createLinkState = false;
        // let endPosition = {x: d3.mouse(this)[0], y:d3.mouse(this)[1]};
          let w = d3.select(zoomElement.parentNode);
          w.on("mousemove", null).on("click", null);
          seft.removeTempLink();
          // seft.createRelationship(selectedNode,endPosition);
      });
    d3.event.preventDefault();
        }
        if (d.data.onClick){
          d.data.onClick(selectedNode);
        }
      }).on("mouseover", (d) => {
      
      }).on("mouseout", (d) => {

      });

    let menu = menuGroup.append("path")
      .attr("fill", (d, i) => {
        return APP_CONFIG.menuColors[i];
      })
      .attr("d", arc)
      .attr("class", "menu-path")

    let menuText = menuGroup.append("text")
      .attr("class", "menu-text")
      .attr("transform", (d) => {
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .text((d) => {
        return d.data.name;
      })
    menuContainer.on('focusout', () => {
      this.hideMenu(true);
    });
    this.refreshMenuPosition = (selected?) => {
      function tweenPie(b) {
        b.outerRadius = this.r + 40;
        b.innerRadius = this.r;
        
        let i = d3.interpolate({startAngle: 0, endAngle: 0, outerRadius: 0, innerRadius: 0}, b);
        return (t) => {
          return arc(i(t));
        };
      }
      if(selected){
        selectedNode = selected;
      }
      if(selectedNode) {
        selectedNode.fx = selectedNode.x;
        selectedNode.fy = selectedNode.y;
        // console.log(selectedNode);
          menuContainer.attr('transform', () => {
    
            return 'translate(' + selectedNode.x + ',' + selectedNode.y + ')';
    
          });
          
          menuContainer.attr("class", "menu");
          menu.transition()
              .ease(d3.easeExpOut)
              .duration(500)
              .attr("d", arc)
              .attrTween("d", tweenPie);
      }
      menuContainer.node().focus();
    }
    this.hideMenu = (focusOut?) => {
      if(focusOut) {
       selectedNode.fx = null;
       selectedNode.fy = null;
      }
      menuContainer.attr("class", "menu menu-hide");
    }
    this.createRelationship = (targetNode: Node) => {
      seft.relationshipService.createRelationship(
                  selectedNode.x,
                  selectedNode.y,
                  targetNode.x,
                  targetNode.y,
                  selectedNode.id,
                  targetNode.id, '1-1', false, false,
                  '', '');
    }
  }

  // OVertexMenu2(svgElement) {
  //   let graph = d3.select(svgElement);
  //   // this.graph = graph;
  //   let menuContainer = graph.append("g");
  //   menuContainer.attr("class", "menu menu-hide");
  //   // menuContainer.attr("transform");
  //   let subSelected = null;


  //   let pie = d3.pie()
  //     .sort(null).value((d) => {
  //       return 1;
  //     });
  //   let arc = d3.arc()
  //     .innerRadius(0)
  //     .outerRadius(0);

  //     var data = [10,20,30,40]
  //   // var self = this;
  //   var menuSel = null;
  //   var menuGroup = menuContainer.selectAll("g")
  //     .data(pie(data))
  //     .enter()
  //     .append("g")
  //     .attr("class", "menu-entry")
  //     .on("click", (d) => {

  //       d3.event.stopPropagation();
  //       if (d.data.onClick)
  //         d.data.onClick(graph.selected);
  //     }).on("mouseover", (d) => {


  //       if (menuSel != null && menuSel != this) {
  //         d3.select(menuSel).selectAll("g.treemenu").remove();
  //         d3.select(menuSel).selectAll("g.submenu").remove();
  //       }
  //       menuSel = this;

  //       if (d.data.submenu) {

  //         if (d.data.submenu.entries instanceof Function) {
  //           var res = d.data.submenu.entries(graph.selected);
  //         } else {
  //           var res = d.data.submenu.entries;
  //         }
  //         if (d.data.submenu.type == 'tree') {


  //           if (!d3.select(this).selectAll("g.treemenu").empty()) {
  //             if (subSelected == d)return;
  //           }
  //           subSelected = d;


  //           var height = 17 * res.length;
  //           var width = 50;
  //           var parent = d;

  //           var orientations = {
  //             "rtl": {
  //               size: [height, width],
  //               width: width,
  //               offset: -width * 2,
  //               x: (d) => {
  //                 return (width * 2) - d.y;
  //               },
  //               xoff: (d) => {
  //                 return (width) - d.y;
  //               },
  //               y: (d) => {
  //                 return d.x;
  //               }
  //             },
  //             "ltr": {
  //               size: [height, width],
  //               width: width,
  //               offset: 0,
  //               x: (d) => {
  //                 return d.y;
  //               },
  //               xoff: (d) => {
  //                 return d.y;
  //               },
  //               y: (d) => {
  //                 return d.x;
  //               }
  //             }
  //           };
  //           var orientation = (d.startAngle >= 0 && d.endAngle <= Math.PI) ? orientations["ltr"] : orientations["rtl"];


  //           var tree = d3.tree().size(orientation.size);
  //           var coord = arc.centroid(d)
  //           var diagonal = d3.diagonal()
  //             .projection((d) => {
  //               return [d.y, d.x];
  //             });


  //           var i = 0;
  //           var data = {name: d.data.name, children: res, x0: coord[0], y0: coord[1], root: true}
  //           var nodes = tree.nodes(data).reverse();
  //           var links = tree.links(nodes);

  //           nodes.forEach((d) => {
  //             d.y = d.depth * orientation.width;
  //           });


  //           var mcontainer = d3.select(this).append('g').attr("class", "treemenu");
  //           mcontainer.attr("transform", (d) => {
  //             return "translate(" + (coord[0] + orientation.offset) + "," + (coord[1] - (height / 2)) + ")";
  //           })
  //           var n = mcontainer.selectAll('g.treenode').data(nodes, (d) => {
  //             return d.id || (d.id = ++i);
  //           });

  //           var nodeEnter = n.enter().append("g")
  //             .attr("class", (d) => {
  //               return d.root ? "treenode-root" : "treenode";
  //             })
  //             .attr("transform", (d) => {
  //               return "translate(" + coord[1] + "," + coord[0] + ")";
  //             })


  //           var txt = nodeEnter.append("text")
  //             .attr("x", (d) => {
  //               return d.children || d._children ? -10 : 10;
  //             })
  //             .attr("dy", ".35em")
  //             .attr("text-anchor", (d) => {
  //               return d.children || d._children ? "end" : "start";
  //             })
  //             .text((d) => {
  //               return d.name;
  //             })
  //             .style("fill-opacity", 1e-6)
  //             .on("click", (d) => {
  //               d.onClick(graph.selected, d.label);
  //             });

  //           var bboxWidth = d3.select(txt.node().parentNode).node().parentNode.getBBox();
  //           var bbox = txt.node().getBBox();
  //           var padding = 2;
  //           nodeEnter.insert("rect", "text")
  //             .attr("x", bbox.x - padding)
  //             .attr("y", bbox.y - padding)
  //             .attr("width", bboxWidth.width + (padding * 2))
  //             .attr("height", bbox.height + (padding * 2))
  //             .attr("class", "tree-text-container");
  //           var nodeUpdate = n.transition()
  //             .duration(750)
  //             .attr("transform", (d) => {
  //               return "translate(" + orientation.xoff(d) + "," + orientation.y(d) + ")";
  //             });


  //           nodeUpdate.select("text")
  //             .style("fill-opacity", 1).attr("class", "tree-text-menu")

  //           var link = mcontainer.selectAll("path.treelink")
  //             .data(links, (d) => {
  //               return d.target.id;
  //             });

  //           // Enter any new links at the parent's previous position.
  //           link.enter().insert("path", "g")
  //             .attr("class", "treelink")
  //             .attr("d", (d) => {
  //               var o = {x: coord[0], y: coord[1]};
  //               return diagonal({source: o, target: o});
  //             });

  //           // Transition links to their new position.
  //           link.transition()
  //             .duration(750)
  //             .attr("d", d3.diagonal().projection((d) => {
  //               return [orientation.x(d), orientation.y(d)];
  //             }));

  //           // Transition exiting nodes to the parent's new position.


  //         } else {


  //           if (!d3.select(this).selectAll("g.submenu").empty()) {
  //             return;
  //           }
  //           var arcSub = d3.arc()
  //             .innerRadius(d.innerRadius + 40)
  //             .outerRadius(d.innerRadius)
  //           var sEntry = d3.select(this).append("g").attr("class", "submenu");
  //           var entryGroup = sEntry.selectAll("g")
  //             .data(pie(res))
  //             .enter()
  //             .append("g")
  //             .attr("class", "submenu-entry")
  //             .on("click", (sd) => {
  //               d3.event.stopPropagation();
  //               if (sd.data.onClick)
  //                 sd.data.onClick(graph.selected, sd.data.name);
  //             })
  //           var submenu = entryGroup.append("path")
  //             .attr("fill", (d, i) => {
  //               return graph.colors(i);
  //             })
  //             .attr("d", arcSub)
  //             .attr("id", (d, i) => {
  //               return "subpath" + i;
  //             })
  //             .attr("class", "menu-path")

  //           var submenuText = entryGroup.append("text")
  //             .attr("class", "menu-text")
  //             .attr("transform", (d) => {
  //               return "translate(" + arcSub.centroid(d) + ")";
  //             })
  //             .attr("dy", ".35em")
  //             .text((d) => {
  //               return d.data.name;
  //             })
  //         }
  //       }
  //     })
  //     .on("mouseout", (d) => {

  //     })

  //   let menu = menuGroup.append("path")
  //     .attr("fill", (d, i) => {
  //       return graph.colors(i);
  //     })
  //     .attr("d", arc)
  //     .attr("class", "menu-path")

  //   let menuText = menuGroup.append("text")
  //     .attr("class", "menu-text")
  //     .attr("transform", (d) => {
  //       return "translate(" + arc.centroid(d) + ")";
  //     })
  //     .attr("dy", ".35em")
  //     .text((d) => {
  //       return d.data.name;
  //     })

  //   this.hide = () => {
  //     clearSubMenu();
  //     menuContainer.attr("class", "menu menu-hide");
  //   }
  //   let clearSubMenu = () => {
  //     if (menuSel != null) {
  //       d3.select(menuSel).selectAll("g.treemenu").remove();
  //     }
  //   }
  //   this.refreshMenuPosition2 = (selR, change) => {
  //     menuContainer.attr('transform', () => {

  //       return 'translate(' + graph.selected.x + ',' + graph.selected.y + ')';

  //     });

  //     let tweenPie;
  //     menuContainer.attr("class", "menu");
  //     tweenPie = (b) => {
  //       b.outerRadius = selR;
  //       b.innerRadius = selR + 40;

  //       var i = d3.interpolate({startAngle: 0, endAngle: 0, outerRadius: 0, innerRadius: 0}, b);
  //       return (t) => {
  //         return arc(i(t));
  //       };
  //     }

  //     arc.innerRadius(selR);
  //     arc.outerRadius(selR + 40);
  //     menu.attr("d", arc);
  //     if (change) {
  //       menu.transition()
  //         .ease("exp-out")
  //         .duration(500)
  //         .attr("d", arc)
  //         .each("end", (d) => {

  //         })
  //         .attrTween("d", tweenPie);

  //     }
  //     menuText.attr("transform", (d) => {
  //       return "translate(" + arc.centroid(d) + ")";
  //     })
  //   }
  // }
  OEdgeMenu(zoomElement) {
    let self = this;
    let selectedEdge: Link;
    let zoomE = d3.select(zoomElement);
    let edgeContainer = zoomE.append('svg:g').attr("class", "edgeMenu hide")


    var width = 40 * APP_CONFIG.edgeMenu.length;
    let tree = d3.tree().size([width, 50]);

    var data = {name: "", children: APP_CONFIG.edgeMenu, x: 0, y: 0, root: true}
    let treeRoot = d3.hierarchy(data);
      treeRoot = tree(treeRoot);
    var nodes = treeRoot.descendants();
    var links = treeRoot.links();

    // Edges between nodes as a <path class="link" />
    // var link = d3.svg.diagonal()
    //   .projection(function (d) {
    //     return [d.y, d.x];
    //   });
    let link = d3.linkHorizontal()
    .x(function(d) { return d.y; })
    .y(function(d) { return d.x; });
    edgeContainer.selectAll("path.enode-link")
      .data(links)
      .enter()
      .append("svg:path")
      .attr("class", "enode-link")
      .attr("d", link);

    edgeContainer.on('focusout', () => {
      this.hideEdgeMenu();
    });

    var nodeGroup = edgeContainer.selectAll("g.enode")
      .data(nodes)
      .enter()
      .append("svg:g")
      .attr("class", "enode")
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    let circle = nodeGroup.append("svg:circle")
      .attr("class", function (d) {
        return d.children ? "enode-root" : "enode-child";
      })
      .attr("r", 15);

    let texts = nodeGroup.append("svg:text")
      .attr("text-anchor", function (d) {
        return d.children ? "end" : "start";
      })
      .attr("class", "menu-text")
      .attr("dy", 5)
      .attr("dx", 1)
      .text(function (d) {
        return d.data.name;
      }).on("click", function (d) {
        if (d.onClick) {
          d3.event.stopPropagation();
          d.onClick(selectedEdge);
        }
      });

    function select(data) {
      let dataE = d3.select(data.elem);
      var bb = dataE.node().getBBox();
      selectedEdge = data.d;
      edgeContainer.attr("class", "edgeMenu")
      edgeContainer.datum({bbox: bb, edge: selectedEdge, elem: dataE});
      // self.refreshEdgeMenuPosition();
      // self.graph.menu.hide();

    }

    this.hideEdgeMenu = function () {
      edgeContainer.attr("class", "edgeMenu hide")
    }
    this.refreshEdgeMenuPosition = function (selected?) {
      select(selected);
      edgeContainer.attr("transform", function (data) {
        if (data) {
          var d = data.edge;
          var bb = data.bbox;

          var deltaX = d.target.x - d.source.x;
          var m = (d.target.y - d.source.y) / (d.target.x - d.source.x);
          var x = (d.target.x + d.source.x) / 2;
          var y = (d.target.y + d.source.y) / 2;
          var val = (Math.atan(m) * 180) / Math.PI;
          val += 90 * (deltaX < 0 ? 1 : -1);
          texts.attr("transform", function (data) {
            return 'rotate( ' + ( -val) + ')';
          })
          if (!isNaN(val)) {
            var offsetX = -bb.width;
            var offsetY = -bb.height;
            if (deltaX < 0) {
              var offsetX = bb.height / 2;
              var offsetY = -bb.width;
            }
            return 'rotate(' + val + ' ' + bb.x + ' ' + bb.y + ') translate(' + (bb.x + offsetX  ) + ' ' + (bb.y + offsetY ) + ')';
          }
        }
      });
      edgeContainer.node().focus();
    }
  }
  computeOptimizeDistance(endPostion, nodeArray : Node[], selectedNode: Node): any {
    let targetNode: Node;
    for(let i = 0; i<nodeArray.length; i++) {
      if (nodeArray[i].id !== selectedNode.id) {
        let distance = this.computeDistance(endPostion.x, endPostion.y, nodeArray[i].x, nodeArray[i].y);
        if (distance <= this.r) {
          targetNode = nodeArray[i];
          break;
        }
    }
    }
    return targetNode;
}
computeDistance(x1: any, y1: any, x2: any, y2: any): any {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
  createTempLink (endPosition, selectedNode: Node) {
    // this.removeTempRelationship(selectedNode);
    // this.relationshipService.createRelationship(
    //     selectedNode.x,
    //     selectedNode.y,
    //     endPosition.x,
    //     endPosition.y,
    //     selectedNode.id, '0', '1-1', false, false,
    //     "top", "top");
    // let links: Link [] = [];
    let target: Node = new Node('');
    target.x = endPosition.x;
    target.y = endPosition.y;
    let link: Link = new Link(selectedNode,target);
    link.isTemp = true;
    // links.push(link);
    this.addedLink.emit(link);
  }
  removeTempLink () {
    this.removedLink.emit({});
  }
  // removeTempRelationship (selectedNode: Node) {
  //   const relateFrom = this.relationshipService.getRelationshipOfEntityFrom(selectedNode.id);
  //   if (relateFrom !== undefined && relateFrom != null) {
  //       relateFrom.forEach((element) => {
  //           if (element.getToEntityId() === '0') {
  //               this.relationshipService.removeRelationshipByid(element.getId());
  //           }
  //       });

  //   }
  // }
  // createRelationship (selectedNode: Node, endPosition) {
  //   let minObject = this.computeOptimizeDistance(endPosition,this.nodes,selectedNode);
  //   this.relationshipService.createRelationship(
  //           selectedNode.x,
  //           selectedNode.y,
  //           minObject.x,
  //           minObject.y,
  //           selectedNode.id,
  //           minObject.id, '1-1', false, false,
  //           '', '');
  //       // remove entityToId = 0
  //       // this.removeTempRelationship(selectedNode);
  // }
  createRelationship (targetNode: Node) {
    
  }

  refreshMenuPosition (selected?) {

  }
  // refreshMenuPosition2 = (selR, change) => {
  // }
  hideMenu (focusOut?) {

  }
  refreshEdgeMenuPosition (selected?) {

  }
  hideEdgeMenu () {

  }
  createLinkWhenMouseMove () {

  }
  
}
