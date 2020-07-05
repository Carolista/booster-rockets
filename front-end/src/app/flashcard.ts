export class Flashcard {

    // same structure as objects in question-bank.json

    id: number;
    category: string;
    topic: string;
    type: string; // TODO: additional question types - short answer, fill-in-the-blank/dropdown, multiple response
    query: string; 
    choices: string[]; 
    answer: string; 

    constructor(category: string, topic: string, type: string, query: string, choices: string[], answer: string) {
        this.category = category;
        this.topic = topic;
        this.type = type;
        this.query = query;
        this.choices = choices;
        this.answer = answer;
    }

}
