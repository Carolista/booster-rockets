export class Question {

    id: number;
    category: string; // specific language, framework, tool, etc.
    type: string; // true/false, multiple choice, etc.
    query: string; 
    choices: string[]; // maybe a different data structure here
    response: string; // maybe change type
    presented: number; // how many times user has been asked this question
    correct: number; // how many times the user answered correctly

}
