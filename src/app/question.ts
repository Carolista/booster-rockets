export class Question {

    // for session and historical stats on an unduplicated question

    id: number;
    cardId: number; // match with question from question bank (JSON)
    presented: number; // how many times user has been asked this question
    correct: number; // how many times the user answered correctly

    constructor(id: number, cardId: number, presented: number, correct: number) {
        this.id = id;
        this.cardId = cardId;
        this.presented = presented;
        this.correct = correct;
    }
    
}
