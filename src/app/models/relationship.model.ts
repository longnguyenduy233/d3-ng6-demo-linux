import { Link } from '../d3/models';

export class Relationship extends Link {
  constructor(
    private id: string,
    private name: string,
    private x1: number,
    private y1: number,
    private x2: number,
    private y2: number,
    private width: number,
    private height: number,
    private fromEntityId: string,
    private toEntityId: string,
    private type: string,
    private startPoint: string,
    private endPoint: string,
    private nameOfColumn: string,
    private displayName: string,
    private description: string,
    private id_number: number,
    private modified?: any
  ) {
    super(fromEntityId, toEntityId);
  }
  getFromEntityId() {
    return this.fromEntityId;
  }
  getToEntityId() {
    return this.toEntityId;
  }
  getId() {
    return this.id;
  }
  setId(id: string) {
    this.id = id;
  }
  getName() {
    return this.name;
  }
  getX1() {
    return this.x1;
  }
  getY1() {
    return this.y1;
  }
  getX2() {
    return this.x2;
  }
  getY2() {
    return this.y2;
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }
  getType() {
    return this.type;
  }
  getStartPoint() {
    return this.startPoint;
  }
  getEndPoint() {
    return this.endPoint;
  }
  getNameOfColumn() {
    return this.nameOfColumn;
  }
  getId_number() {
    return this.id_number;
  }
  getDisplayName() {
    return this.displayName;
  }
  getDescription() {
    return this.description;
  }
  setId_number(id_number: number) {
    this.id_number = id_number;
  }
  setFromEntityId(fromEntityId: any) {
    this.fromEntityId = fromEntityId;
  }
  setToEntityId(toEntityId: any) {
    this.toEntityId = toEntityId;
  }
  setModified(modified: any) {
    this.modified = modified;
  }
  getModified() {
    return this.modified;
  }
}
