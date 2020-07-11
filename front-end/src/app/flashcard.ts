export class Flashcard {

    // same structure as objects in question-bank.json

    id: number;
    category: string;
    topic: string;
    type: string; // TODO: additional question types - short answer, fill-in-the-blank/dropdown, multiple response
    query: string; 
    answer: string; 
    choiceB: string;
    choiceC: string;
    choiceD: string;
    choiceE: string;

    constructor(category: string, topic: string, type: string, query: string, answer: string, choiceB: string, choiceC: string = "", choiceD: string = "", choiceE: string = "") {
        this.category = category;
        this.topic = topic;
        this.type = type;
        this.query = query;
        this.answer = answer;
        this.choiceB = choiceB;
        this.choiceC = choiceC;
        this.choiceD = choiceD;
        this.choiceE = choiceE;
    }

}
