import { Node } from '../d3/models';
/**
 * The class represent for an entity on workspace
 */
export class Entity extends Node {
  /**
   * Constructor of each entity object
   * @param name Entity's name
   * @param x x axis position
   * @param y y axis position
   * @param width the width of drawn entity
   * @param height the height of drawn entity
   * @param properties list of user-defined properties
   */
  constructor(
    id: string,
    private name: string,
    private displayName: string,
    private width: number,
    private height: number,
    private screenWidth: number,
    private screenHeight: number,
    private shape: string,
    private id_number: number,
    private modified?: any
  ) {
    super(id);
  }
  setId(id: string) {
    this.id = id;
  }
  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
  setX(x: number) {
    this.x = x;
  }
  setY(y: number) {
    this.y = y;
  }
  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }



  getDisplayName() {
    return this.displayName;
  }
  setDisplayName(displayName: string) {
    this.displayName = displayName;
  }
  getScreenWidth() {
    return this.screenWidth;
  }
  setScreenWidth(screenWidth: number) {
    this.screenWidth = screenWidth;
  }
  getScreenHeight() {
    return this.screenHeight;
  }
  setScreenHeight(screenHeight: number) {
    this.screenHeight = screenHeight;
  }
  getShape() {
    return this.shape;
  }
  setShape(shape: string) {
    this.shape = shape;
  }
  getId_number() {
    return this.id_number;
  }
  setId_number(id_number: number) {
    this.id_number = id_number;
  }
  setModified(modified: any) {
    this.modified = modified;
  }
  getModified() {
    return this.modified;
  }
}
