export class Statistics {

    id: number; // assigned on back end

    presented: number = 0; // represents instances of flashcard presentation, not unduplicated questions
    correct: number = 0;
    accuracy: number = 0; // percentage correct

    currentStreak: number = 0; // how many correct answers in a row 
    longestStreak: number= 0; // record number of correct answers in a row

}
