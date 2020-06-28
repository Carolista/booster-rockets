export class Filters {

    id: number;
    categories: string[]; 
    topics: string[];
    types: string[];

    constructor(categories: string[], topics: string[], types: string[]) {
        this.categories = categories;
        this.topics = topics;
        this.types = types;
    }
    
}
