export class Filters {

    id: number;
    categories: string[]; 
    topics: string[];
    types: string[];

    constructor(id: number, categories: string[], topics: string[], types: string[]) {
        this.id = id;
        this.categories = categories;
        this.topics = topics;
        this.types = types;
    }
    
}
