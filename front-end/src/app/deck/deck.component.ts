import { Component, OnInit } from '@angular/core';
import allFlashcards from '../../assets/question-bank.json';
import { Flashcard } from '../flashcard';
import { Question } from '../question';
import { Filters } from '../filters';
import { Statistics } from '../statistics';

@Component({
  selector: 'app-flashcard',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})

export class DeckComponent implements OnInit {

  flashcards: Flashcard[];
  currentCard: Flashcard;
  currentQuestion: Question;
  currentIndex: number = 0;
  currentResponse: string;
  answered: boolean = false;
  correct: boolean = true;

  // temporarily hard-code Filters object to test function in buildFlashcardSet
  filters: Filters = new Filters(["JavaScript", "Angular", "Thymeleaf", "SQL"], ["Queries", "Arrays", "General"], ["Multiple Choice","True/False"]);

  // temporarily hard-code Question array to test statistics calculations
  questions: Question[] = [
    new Question(1, 3, 2),
    new Question(2, 4, 3),
    new Question(5, 6, 5),
    new Question(7, 4, 4),
    new Question(9, 2, 1)
  ]

  // temporarily hard-code Statistics object to test statistics calculations
  statistics: Statistics = new Statistics();

  constructor() { 
  }

  ngOnInit() {
    this.buildFlashcardSet();
  }

  // create randomized list of questions based on user's criteria
  buildFlashcardSet() {

    // build flashcard set for this session from question bank
    this.flashcards = [];
    // TODO: use criteria instead of adding all
    allFlashcards.forEach(obj => {
      let card = new Flashcard(obj.category, obj.topic, obj.type, obj.query, obj.choices, obj.answer);
      // add card to deck only if it fits user's criteria
      if (this.filters.categories.includes(card.category) && this.filters.topics.includes(card.topic) && this.filters.types.includes(card.type)) {
        if (card.type === "Multiple Choice") { // TODO: add other types in future as needed
          this.shuffle(card.choices);
        }
        this.flashcards.push(card);
        console.log("added question to deck: " + card.query);
      }      
    });

    // TODO: if user is given choice to sort by category:
    // this.flashcards.sort((a, b) => (a.category > b.category) ? 1 : -1);

    this.shuffle(this.flashcards);
    this.currentCard = this.flashcards[this.currentIndex];
    this.setCurrentQuestion();
    console.log("Flashcard deck built.")
  }

  checkAnswer() {
    this.answered = true;
    let index = this.findQuestionByCardId(this.currentCard.id);
    if (index === -1) {
      let question = new Question(this.currentCard.id, 0, 0);
      this.questions.push(question);
      index = this.questions.length - 1;
    }
    this.questions[index].presented++;
    this.statistics.presented++;
    if (this.currentResponse === this.currentCard.answer) {
      this.questions[index].correct++;
      this.statistics.correct++;
      this.statistics.currentStreak++;
      if (this.statistics.currentStreak > this.statistics.longestStreak) {
        this.statistics.longestStreak = this.statistics.currentStreak;
      }
      this.correct = true;
    } else {
      this.correct = false;
    }
    console.log(this.questions[index]);
  }

  setCurrentQuestion() {
    let index = this.findQuestionByCardId(this.currentCard.id);
    if (index === -1) {
      this.currentQuestion = new Question(this.currentCard.id, 0, 0); 
    } else {
      this.currentQuestion = this.questions[index];
    }
  }

  getSuccessRate(): number {
    return Math.round((this.currentQuestion.correct / this.currentQuestion.presented) * 100);
  }

  getNextCard() {
    if (this.currentIndex === this.flashcards.length - 1) {
      // TODO: need to ask if they want to start again and then maybe reshuffle?
      this.currentIndex = 0; // this works to return to beginning and loop through in existing order
    } else {
      this.currentIndex++;
    }
    this.currentCard = this.flashcards[this.currentIndex];
    this.setCurrentQuestion();
    // TODO: eventually use this to rotate graphics for changing flashcards

    this.answered = false;
  }

  // TODO: send updates to back end with each answer in case user exits page/browser mid-session

  findQuestionByCardId(cardId: number): number {
    let question: Question;
    for (let i = 0; i < this.questions.length; i++) {
      question = this.questions[i];
      if (question.cardId === cardId) {
        return i;
      }
    }
    return -1;
  }

  shuffle(array: any[]): any[] {
    let current = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== current) { 
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * current);
      current -= 1;
      // And swap it with the current element.
      temporaryValue = array[current];
      array[current] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

}
