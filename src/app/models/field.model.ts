export class Field {
    constructor(
        private id?: string,
        private name?: string,
        private displayName?: string,
        private description?: string,
        private unique?: boolean,
        private required?: boolean,
        private searchable?: boolean,
        private maxLength?: number,
        private defaultValue?: string,
        private entitiesId?: string,
        private dataTypesId?: string,
        private dataTypesName?: string,
        private id_number?: number,
        private modified?: any
    ) { }
    getId() {
        return this.id;
    }
    setId(id: string) {
        this.id = id;
    }
    getDataTypesName() {
        return this.dataTypesName;
    }
    setDataTypesName(dataTypesName: string) {
        this.dataTypesName = dataTypesName;
    }
    getName() {
        return this.name;
    }
    setName(name: string) {
        this.name = name;
    }
    getUnique() {
        return this.unique;
    }
    setUnique(unique: boolean) {
        this.unique = unique;
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
    getRequired() {
        return this.required;
    }
    setRequired(required: boolean) {
        this.required = required;
    }
    getSearchable() {
        return this.searchable;
    }
    setSearchable(searchable: boolean) {
        this.searchable = searchable;
    }
    getMaxLength() {
        return this.maxLength;
    }
    setMaxLength(maxLength: number) {
        this.maxLength = maxLength;
    }
    getDefaultValue() {
        return this.defaultValue;
    }
    setDefaultValue(defaultValue: string) {
        this.defaultValue = defaultValue;
    }
    getEntitiesId() {
        return this.entitiesId;
    }
    setEntitiesId(entitiesId: string) {
        this.entitiesId = entitiesId;
    }
    getDataTypesId() {
        return this.dataTypesId;
    }
    setDataTypesId(dataTypesId: string) {
        this.dataTypesId = dataTypesId;
    }
    setModified(modified: any) {
        this.modified = modified;
    }
    getModified() {
        return this.modified;
    }
}
