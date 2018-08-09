import { EventEmitter } from '@angular/core';
import { Relationship } from '../models/relationship.model';

export class RelationshipService {

    private relationships: Relationship[] = [];

    addedRelationship = new EventEmitter<Relationship[]>();
    creatingRelationshipFromEntity = new EventEmitter<{}>();
    selectedRelationship = new EventEmitter<Relationship>();
    removedRelationship = new EventEmitter<Relationship[]>();
    loadAllRelationshipWhenChangeFreeTabEvent = new EventEmitter<{}>();
    updateRelationshipAPIWhenChangeGridTabEvent = new EventEmitter<{}>();
    constructor() { }
    getRelationships(): Relationship[] {
        return this.relationships.slice();
    }
    addRelationship(relationship: Relationship): void {
        let duplicateRelationshipFlag = false;
        for (let i = 0; i < this.relationships.length; i++) {
            if (this.relationships[i].getFromEntityId() == relationship.getFromEntityId() && this.relationships[i].getToEntityId() == relationship.getToEntityId()) {
                duplicateRelationshipFlag = true;
                break;
            }
        }
        if (duplicateRelationshipFlag) {
            return;
        }
        this.relationships.push(relationship);
        this.addedRelationship.emit(this.relationships);
    }
    checkDuplicateName(name: String): boolean {
        let index: any;
        
        index = this.relationships.findIndex((x) => x.getName() === name);
        if (index !== -1) {
            return true;
        } else {
            return false;
        }
    }
    createRelationship(x1: any, y1: any, x2: any, y2: any, fromEntityId: any, toEntityId: any, type: any, isTransformedFrom: boolean, isTransformedTo: boolean, startPoint: string, endPoint: string, name?: string, id?: any, id_number?: number, modified?: any) {
        const points = { x1, y1, x2, y2, fromEntityId, toEntityId, type, isTransformedFrom, isTransformedTo, startPoint, endPoint, name, id, id_number, modified };
        let relationshipId = (id !== undefined && id != null) ? id : this.getMaxRelationshipId() + 1;
        const relationship_id_number = (id_number !== undefined && id_number != null) ? id_number : relationshipId;
        const relationship_modified = (modified !== undefined && modified != null) ? modified : 'modified';
        let relationshipName: any;
        if (name !== undefined && name != null) {
            relationshipName = name;
        } else {
            relationshipName = 'Relationship' + relationshipId;
            while (this.checkDuplicateName(relationshipName)) {
                relationshipId += 1;
                relationshipName = 'Relationship' + relationshipId;
            }
        }
        const relationship: Relationship = new Relationship(
            relationshipId,
            relationshipName,
            x1,
            y1,
            x2,
            y2,
            0,
            0,
            fromEntityId,
            toEntityId,
            type,
            startPoint,
            endPoint,
            '',
            relationshipName,
            '',
            relationship_id_number,
            relationship_modified
        );
        this.addRelationship(relationship);
        // this.creatingRelationshipFromEntity.emit(points);
    }
    onSelectedRelationship(selectedRelationship: Relationship) {
        this.selectedRelationship.emit(selectedRelationship);
    }
    getRelationshipById(id) {
        return this.relationships.find((x) => x.getId() == id);
    }
    getRelationshipOfEntityFrom(entityId) {
        return (this.relationships.filter((x) => x.getFromEntityId() == entityId));
    }
    getRelationshipOfEntityTo(entityId) {
        return (this.relationships.filter((x) => x.getToEntityId() == entityId));
    }
    getMaxRelationshipId() {
        if (this.relationships.length == 0) {
            return 0;
        } else {
            return Math.max.apply(Math, this.relationships.map(function (o) { return o.getId_number(); }));
        }
    }
    removeRelationshipByid(id) {
        if (this.relationships && this.relationships.length > 0) {
            const result: Relationship = this.getRelationshipById(id);
            const index = this.relationships.indexOf(result);
            this.relationships.splice(index, 1);
            this.removedRelationship.emit(this.relationships);
        }
    }
    removeRelationshipByEntity(entityId) {
        if (this.relationships && this.relationships.length > 0) {
            const listRelationshipOfEntity: Relationship[] = this.relationships.filter((x) => (x.getFromEntityId() === entityId || x.getToEntityId() === entityId));
            listRelationshipOfEntity.forEach((element) => {
                this.removeRelationshipByid(element.getId());
            });
        }
    }
    loadAllRelationshipWhenChangeFreeTab() {
        // if (this.entities.length === 0) {
        this.loadAllRelationshipWhenChangeFreeTabEvent.emit();
        // }
    }
    loadAllRelationshipFromAPI(relationships: Relationship[]) {
        this.relationships = [];
        this.relationships = relationships;
        this.addedRelationship.emit(this.relationships);
    }
    updateRelationshipAPI() {
        this.updateRelationshipAPIWhenChangeGridTabEvent.emit();
    }
    updateAllRelationshipEntityIdWithNewIdFromAPI(oldEntityId, entityId) {
        if (this.relationships && this.relationships.length > 0) {
            const listRelationshipOfEntity: Relationship[] = this.getRelationshipOfEntityFrom(oldEntityId);
            listRelationshipOfEntity.forEach((element) => {
                element.setFromEntityId(entityId);
            });
            const listRelationshipOfEntityTo: Relationship[] = this.getRelationshipOfEntityTo(oldEntityId);
            listRelationshipOfEntityTo.forEach((element) => {
                element.setToEntityId(entityId);
            });
        }
    }
}
