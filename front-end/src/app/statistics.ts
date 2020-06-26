export class Statistics {

    id: number; // assigned on back end

    presented: number = 0; // represents instances of flashcard presentation, not unduplicated questions
    correct: number = 0;
    accuracy: number = 0; // percentage correct

    currentStreak: number = 0; // how many correct answers in a row 
    longestStreak: number= 0; // record number of correct answers in a row

    // TODO: maybe do away with these two since they are calculated using other saved data
    categories: number = 0; // how many different languages, frameworks, etc. have been practiced
    topics: number = 0; // how many different topics have been practiced

}
