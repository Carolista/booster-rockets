export class Flashcard {

    // same structure as objects in question-bank.json

    id: number;
    category: string;
    type: string;
    query: string; 
    choices: string[]; 
    answer: string; 

    constructor(id: number, category: string, type: string, query: string, choices: string[], answer: string) {
        this.id = id;
        this.category = category;
        this.type = type;
        this.query = query;
        this.choices = choices;
        this.answer = answer;
    }

}
