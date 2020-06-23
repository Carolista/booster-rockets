export class Statistics {

    id: number;
    answered: number; // represents instances of flashcard presentation, not unduplicated questions
    correct: number;
    accuracy: number; // percentage correct
    categories: number; // how many different languages, frameworks, etc. have been practiced
    streak: number; // how many days in a row user has practiced
    
    // more specific stats (like accuracy per category) could be calculated directly from unduplicated list of questions
}
