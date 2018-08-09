import { EventEmitter, Injectable } from '@angular/core';
import { Entity } from '../models/entity.model';
import { RelationshipService } from './relationship.service';
import { FieldService } from './field.service';
import { Node } from '../d3/models'

@Injectable()
export class EntityService {
  private entities: Entity[] = [];
  private entityArrayForRelationship: Entity[] = [];
  // nodes: Node[] = [];

  addedEntity = new EventEmitter<Entity[]>();
  addedNode = new EventEmitter<Entity>();
  selectedEntity = new EventEmitter<Entity>();
  allowToAddProperty = new EventEmitter<boolean>();
  lockAppMovableEntity = new EventEmitter<boolean>();
  addedEntityArrayForRelationship = new EventEmitter<Entity[]>();
  reloadDataList = new EventEmitter<{}>();
  updatePositionOfEntity = new EventEmitter<{}>(true);
  loadAllEntityWhenChangeFreeTabEvent = new EventEmitter<{}>();
  updateEntityAPIWhenChangeGridTabEvent = new EventEmitter<{}>();
  removedEntity = new EventEmitter<Entity[]>();

  constructor(
    private relationshipService: RelationshipService,
    private fieldService: FieldService
  ) {
  }

  getEntities(): Entity[] {
    return this.entities.slice();
  }

  addEntity(entity: Entity): void {
    this.entities.push(entity);
    this.addedEntity.emit(this.entities);
    this.addedNode.emit(entity);
  }

  onSelectedEntity(selectedEntity: Entity) {
    this.selectedEntity.emit(selectedEntity);
    this.allowToAddProperty.emit(true);
  }

  getEntityById(id) {
    return this.entities.find((x) => x.getId() == id);
  }






  getMaxEntityId() {
    if (this.entities.length == 0) {
      return 0;
    } else {
      return Math.max.apply(Math, this.entities.map(function (o) { return o.getId_number(); }));
    }
  }
  onLockAppMovableEntity() {
    this.lockAppMovableEntity.emit(true);
  }
  onOpenAppMovableEntity() {
    this.lockAppMovableEntity.emit(false);
  }
  addEntityArrayForRelationship(entity: Entity): void {
    this.entityArrayForRelationship.push(entity);
    this.addedEntityArrayForRelationship.emit(this.entityArrayForRelationship);
  }
  updatePositionOfOutsideEntity(entityId: any, entityPositionX: any, entityPositionY: any) {
    const newEntityPosition = { Id: entityId, x: entityPositionX, y: entityPositionY };
    this.updatePositionOfEntity.emit(newEntityPosition);
  }
  loadAllEntityWhenChangeFreeTab() {
    // if (this.entities.length === 0) {
    this.loadAllEntityWhenChangeFreeTabEvent.emit();
    // }
  }
  loadAllEntityFromAPI(entities: Entity[]) {
    this.entities = [];
    this.entities = entities;
    this.addedEntity.emit(this.entities);
  }
  updateEntityAPI() {
    this.updateEntityAPIWhenChangeGridTabEvent.emit();
  }
  removeEntityByid(id) {
    // remove all field of entity
    this.fieldService.removeFieldByEntity(id);
    // remove all relationship of entity
    this.relationshipService.removeRelationshipByEntity(id);
    // remove entity
    if (this.entities && this.entities.length > 0) {
      const result: Entity = this.getEntityById(id);
      const index = this.entities.indexOf(result);
      this.entities.splice(index, 1);
      this.removedEntity.emit(this.entities);
    }
  }

}
