import { EventEmitter } from '@angular/core';
import { Field } from '../models/field.model';

export class FieldService {
    private fields: Field[] = [];

    addedField = new EventEmitter<Field[]>();
    removedField = new EventEmitter<Field[]>();
    loadAllFieldWhenChangeFreeTabEvent = new EventEmitter<{}>();
    updateFieldAPIWhenChangeGridTabEvent = new EventEmitter<{}>();
    constructor() { }
    getFields(): Field[] {
        return this.fields.slice();
    }
    addField(field: Field): void {
        let duplicateFieldNameFlag = false;
        const listFieldOfEntity: Field[] = this.getAllFieldOfEntity(field.getEntitiesId());
        for (let i = 0; i < listFieldOfEntity.length; i++) {
            if (listFieldOfEntity[i].getName() === field.getName()) {
                duplicateFieldNameFlag = true;
                break;
            }
        }
        if (duplicateFieldNameFlag) {
            return;
        }
        this.fields.push(field);
        this.addedField.emit(this.fields);
    }
    getAllFieldOfEntity(entityId: any) {
        return this.fields.filter((x) => x.getEntitiesId() === entityId);
    }
    // onSelectedRelationship(selectedRelationship: Relationship) {
    //     this.selectedRelationship.emit(selectedRelationship);
    // }
    getFieldById(id) {
        return this.fields.find((x) => x.getId() === id);
    }
    getMaxFieldId() {
        if (this.fields.length == 0) {
            return 0;
        } else {
            return Math.max.apply(Math, this.fields.map(function (o) { return o.getId_number(); }));
        }
    }
    removeFieldByid(id) {
        if (this.fields && this.fields.length > 0) {
            const result: Field = this.getFieldById(id);
            const index = this.fields.indexOf(result);
            this.fields.splice(index, 1);
            this.removedField.emit(this.fields);
        }
    }
    removeFieldByEntity(entityId) {
        if (this.fields && this.fields.length > 0) {
            const listFieldOfEntity: Field[] = this.fields.filter((x) => (x.getEntitiesId() === entityId));
            listFieldOfEntity.forEach((element) => {
                this.removeFieldByid(element.getId());
            });
        }
    }
    loadAllFieldWhenChangeFreeTab() {
        // if (this.fields.length === 0) {
        this.loadAllFieldWhenChangeFreeTabEvent.emit();
        // }
    }
    loadAllFieldFromAPI(fields: Field[]) {
        this.fields = [];
        this.fields = fields;
        this.addedField.emit(this.fields);
    }
    updateFieldAPI() {
        this.updateFieldAPIWhenChangeGridTabEvent.emit();
    }
    updateAllFieldEntityIdWithNewIdFromAPI(oldEntityId, entityId) {
        if (this.fields && this.fields.length > 0) {
            const listFieldOfEntity: Field[] = this.getAllFieldOfEntity(oldEntityId);
            listFieldOfEntity.forEach((element) => {
                element.setEntitiesId(entityId);
            });
        }
    }
}
