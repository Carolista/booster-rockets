export class Question {

    // for session and historical stats on an unduplicated question

    id: number;
    cardId: number; // match with question from question bank (JSON)
    presented: number; // how many times user has been asked this question
    correct: number; // how many times the user answered correctly

}
