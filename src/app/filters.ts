export class Filters {

    id: number;
    categories: string[]; 
    // TODO: add topic property
    types: string[];

    constructor(id: number, categories: string[], types: string[]) {
        this.id = id;
        this.categories = categories;
        this.types = types;
    }
    
}
